import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

async function updateAdmin() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db!;
  const usersCol = db.collection('users');

  // Update demo@example.com to admin with new password
  const hashedPassword = await bcrypt.hash('adminofsaas', 12);

  const result = await usersCol.updateOne(
    { email: 'demo@example.com' },
    {
      $set: {
        role: 'admin',
        password: hashedPassword,
      },
    }
  );

  if (result.matchedCount > 0) {
    console.log('Updated demo@example.com:');
    console.log('  - Role set to: admin');
    console.log('  - Password changed to: adminofsaas');
  } else {
    console.log('User demo@example.com not found!');
  }

  // Ensure all other users have role "user"
  const otherResult = await usersCol.updateMany(
    { email: { $ne: 'demo@example.com' }, role: { $exists: false } },
    { $set: { role: 'user' } }
  );
  console.log(`Set ${otherResult.modifiedCount} other users to role: user`);

  // Initialize loginHistory for users that don't have it
  const historyResult = await usersCol.updateMany(
    { loginHistory: { $exists: false } },
    { $set: { loginHistory: [] } }
  );
  console.log(`Initialized loginHistory for ${historyResult.modifiedCount} users`);

  await mongoose.disconnect();
  console.log('\nDone! Admin login:');
  console.log('  Email: demo@example.com');
  console.log('  Password: adminofsaas');
}

updateAdmin().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
