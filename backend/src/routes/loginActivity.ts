import { Router, Response } from 'express';
import LoginActivity from '../models/LoginActivity';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/login-activity - Get all login activities (requires auth)
router.get('/', authMiddleware, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt((_req.query.page as string) || '1'));
    const limit = Math.min(100, Math.max(1, parseInt((_req.query.limit as string) || '20')));
    const search = (_req.query.search as string) || '';

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { userName: { $regex: search, $options: 'i' } },
        { userEmail: { $regex: search, $options: 'i' } },
      ];
    }

    const [activities, total] = await Promise.all([
      LoginActivity.find(filter)
        .sort({ loginAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('userName userEmail loginAt ipAddress -_id'),
      LoginActivity.countDocuments(filter),
    ]);

    res.json({
      activities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
