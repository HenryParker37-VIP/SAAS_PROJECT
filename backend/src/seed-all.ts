import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from './models/User';
import DashboardData from './models/DashboardData';

const products = ['Analytics Pro', 'Cloud Storage', 'API Gateway', 'Auth Service', 'Data Pipeline'];
const regions = ['North America', 'Europe', 'Asia'];
const statuses: Array<'completed' | 'pending' | 'failed'> = ['completed', 'completed', 'completed', 'pending', 'failed'];
const firstNames = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank', 'Grace', 'Hank', 'Ivy', 'Jack'];
const lastNames = ['Johnson', 'Smith', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const descriptions = [
  'Enterprise license renewal', 'New subscription signup', 'Quarterly plan upgrade',
  'Annual subscription', 'Team plan expansion', 'Premium feature add-on',
  'Usage-based billing cycle', 'Startup plan activation', 'Migration from competitor', 'Contract extension',
];

function randomDate(monthsAgo: number): Date {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
  return new Date(start.getTime() + Math.random() * (now.getTime() - start.getTime()));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seedAll() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('Connected to MongoDB');

  // Find ALL users
  const users = await User.find({});
  console.log(`Found ${users.length} users`);

  for (const user of users) {
    const existingCount = await DashboardData.countDocuments({ userId: user._id });
    if (existingCount >= 20) {
      console.log(`${user.email} already has ${existingCount} transactions, skipping`);
      continue;
    }

    // Generate 30-50 transactions for this user
    const txCount = 30 + Math.floor(Math.random() * 20);
    const transactions = [];

    const baseRevenue: Record<string, number> = {
      'Analytics Pro': 2000, 'Cloud Storage': 1200, 'API Gateway': 3000,
      'Auth Service': 800, 'Data Pipeline': 4000,
    };

    for (let i = 0; i < txCount; i++) {
      const product = pick(products);
      transactions.push({
        userId: user._id,
        date: randomDate(6),
        product,
        revenue: Math.floor(baseRevenue[product] * (0.5 + Math.random())),
        region: pick(regions),
        status: pick(statuses),
        description: pick(descriptions),
        customerName: `${pick(firstNames)} ${pick(lastNames)}`,
        quantity: Math.floor(Math.random() * 10) + 1,
      });
    }

    await DashboardData.insertMany(transactions);
    console.log(`Added ${txCount} transactions for ${user.email}`);
  }

  await mongoose.disconnect();
  console.log('Done!');
}

seedAll().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
