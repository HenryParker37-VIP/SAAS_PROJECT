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
  'Enterprise license renewal',
  'New subscription signup',
  'Quarterly plan upgrade',
  'Annual subscription',
  'Team plan expansion',
  'Premium feature add-on',
  'Usage-based billing cycle',
  'Startup plan activation',
  'Migration from competitor',
  'Contract extension',
];

function randomDate(monthsAgo: number): Date {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await DashboardData.deleteMany({});
  console.log('Cleared existing data');

  // Create demo users
  const demoUsers = [
    { email: 'demo@example.com', password: 'adminofsaas', name: 'Demo User', role: 'admin' as const },
    { email: 'alice@example.com', password: 'password123', name: 'Alice Johnson' },
    { email: 'bob@example.com', password: 'password123', name: 'Bob Smith' },
    { email: 'carol@example.com', password: 'password123', name: 'Carol Williams' },
    { email: 'admin@example.com', password: 'admin123', name: 'Admin User' },
  ];

  const users = await User.create(demoUsers);
  console.log(`Created ${users.length} users`);

  // Generate transactions for each user
  const allTransactions = [];

  for (const user of users) {
    const txCount = 20 + Math.floor(Math.random() * 30); // 20-50 per user
    for (let i = 0; i < txCount; i++) {
      const product = pick(products);
      const baseRevenue: Record<string, number> = {
        'Analytics Pro': 2000,
        'Cloud Storage': 1200,
        'API Gateway': 3000,
        'Auth Service': 800,
        'Data Pipeline': 4000,
      };

      allTransactions.push({
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
  }

  await DashboardData.insertMany(allTransactions);
  console.log(`Created ${allTransactions.length} transactions`);

  console.log('\n--- Admin Credentials ---');
  console.log('Email: demo@example.com');
  console.log('Password: adminofsaas');
  console.log('------------------------\n');

  await mongoose.disconnect();
  console.log('Seed complete!');
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
