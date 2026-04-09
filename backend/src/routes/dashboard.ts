import { Router, Response } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import DashboardData from '../models/DashboardData';

const router = Router();

router.use(authMiddleware);

// GET /api/dashboard - Get dashboard summary data
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId!);

    const [totalRevenue, transactionCount, regionDistribution, monthlyRevenue, productSales] =
      await Promise.all([
        // Total revenue
        DashboardData.aggregate([
          { $match: { userId, status: 'completed' } },
          { $group: { _id: null, total: { $sum: '$revenue' } } },
        ]),
        // Transaction count
        DashboardData.countDocuments({ userId }),
        // Region distribution
        DashboardData.aggregate([
          { $match: { userId } },
          { $group: { _id: '$region', count: { $sum: 1 }, revenue: { $sum: '$revenue' } } },
          { $sort: { revenue: -1 } },
        ]),
        // Monthly revenue (last 6 months)
        DashboardData.aggregate([
          { $match: { userId, status: 'completed' } },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
              revenue: { $sum: '$revenue' },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
          { $limit: 6 },
        ]),
        // Product sales
        DashboardData.aggregate([
          { $match: { userId, status: 'completed' } },
          { $group: { _id: '$product', totalRevenue: { $sum: '$revenue' }, count: { $sum: 1 } } },
          { $sort: { totalRevenue: -1 } },
        ]),
      ]);

    const completedCount = await DashboardData.countDocuments({ userId, status: 'completed' });
    const previousMonthRevenue = monthlyRevenue.length >= 2
      ? monthlyRevenue[monthlyRevenue.length - 2].revenue
      : 0;
    const currentMonthRevenue = monthlyRevenue.length >= 1
      ? monthlyRevenue[monthlyRevenue.length - 1].revenue
      : 0;
    const growthRate = previousMonthRevenue > 0
      ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
      : 0;

    res.json({
      metrics: {
        totalRevenue: totalRevenue[0]?.total || 0,
        totalTransactions: transactionCount,
        completedTransactions: completedCount,
        growthRate: Math.round(growthRate * 10) / 10,
      },
      monthlyRevenue: monthlyRevenue.map((m) => ({
        month: m._id,
        revenue: m.revenue,
        transactions: m.count,
      })),
      productSales: productSales.map((p) => ({
        product: p._id,
        revenue: p.totalRevenue,
        count: p.count,
      })),
      regionDistribution: regionDistribution.map((r) => ({
        region: r._id,
        count: r.count,
        revenue: r.revenue,
      })),
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/dashboard/transactions - Get transactions with filters
router.get('/transactions', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId!);
    const {
      page = '1',
      limit = '20',
      product,
      region,
      status,
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'desc',
      search,
    } = req.query;

    const filter: Record<string, unknown> = { userId };

    if (product) filter.product = product;
    if (region) filter.region = region;
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) (filter.date as Record<string, unknown>).$gte = new Date(startDate as string);
      if (endDate) (filter.date as Record<string, unknown>).$lte = new Date(endDate as string);
    }
    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)));
    const sortDir = sortOrder === 'asc' ? 1 : -1;

    const [transactions, total] = await Promise.all([
      DashboardData.find(filter)
        .sort({ [sortBy as string]: sortDir })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      DashboardData.countDocuments(filter),
    ]);

    res.json({
      transactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Validation schema for creating/updating transactions
const transactionSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  product: z.enum(['Analytics Pro', 'Cloud Storage', 'API Gateway', 'Auth Service', 'Data Pipeline'], {
    errorMap: () => ({ message: 'Invalid product' }),
  }),
  revenue: z.number().min(0, 'Revenue must be positive'),
  region: z.enum(['North America', 'Europe', 'Asia'], {
    errorMap: () => ({ message: 'Invalid region' }),
  }),
  status: z.enum(['completed', 'pending', 'failed'], {
    errorMap: () => ({ message: 'Invalid status' }),
  }),
  description: z.string().min(1, 'Description is required').max(500),
  customerName: z.string().min(1, 'Customer name is required').max(200),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

// POST /api/dashboard/transactions - Create a new transaction
router.post('/transactions', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = transactionSchema.parse(req.body);
    const userId = new mongoose.Types.ObjectId(req.userId!);

    const transaction = await DashboardData.create({
      ...data,
      date: new Date(data.date),
      userId,
    });

    res.status(201).json({ transaction });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message });
      return;
    }
    console.error('Create transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/dashboard/transactions/:id - Update a transaction
router.put('/transactions/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = transactionSchema.parse(req.body);
    const userId = new mongoose.Types.ObjectId(req.userId!);

    const transaction = await DashboardData.findOneAndUpdate(
      { _id: req.params.id, userId },
      { ...data, date: new Date(data.date) },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }

    res.json({ transaction });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message });
      return;
    }
    console.error('Update transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/dashboard/transactions/:id - Delete a transaction
router.delete('/transactions/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId!);

    const transaction = await DashboardData.findOneAndDelete({ _id: req.params.id, userId });

    if (!transaction) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/dashboard/export - Export data as CSV
router.post('/export', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId!);
    const { product, region, status, startDate, endDate } = req.body;

    const filter: Record<string, unknown> = { userId };
    if (product) filter.product = product;
    if (region) filter.region = region;
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) (filter.date as Record<string, unknown>).$gte = new Date(startDate);
      if (endDate) (filter.date as Record<string, unknown>).$lte = new Date(endDate);
    }

    const transactions = await DashboardData.find(filter).sort({ date: -1 }).lean();

    const headers = ['Date', 'Product', 'Customer', 'Revenue', 'Quantity', 'Region', 'Status', 'Description'];
    const csvRows = [headers.join(',')];

    for (const t of transactions) {
      csvRows.push(
        [
          new Date(t.date).toISOString().split('T')[0],
          `"${t.product}"`,
          `"${t.customerName}"`,
          t.revenue,
          t.quantity,
          `"${t.region}"`,
          t.status,
          `"${t.description.replace(/"/g, '""')}"`,
        ].join(',')
      );
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
    res.send(csvRows.join('\n'));
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
