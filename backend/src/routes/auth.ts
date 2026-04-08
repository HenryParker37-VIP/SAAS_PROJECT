import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required').max(100),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

function generateToken(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
}

// POST /api/auth/signup
router.post('/signup', async (req, res: Response): Promise<void> => {
  try {
    const { email, password, name } = signupSchema.parse(req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email already registered' });
      return;
    }

    const user = await User.create({ email, password, name });
    const token = generateToken(String(user._id));

    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res: Response): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Record login
    user.lastLogin = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();

    const token = generateToken(String(user._id));

    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/user/admin/users - Get all users (admin view)
router.get('/admin/users', authMiddleware, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find({}, 'name email lastLogin loginCount createdAt').sort({ lastLogin: -1 });
    res.json({
      users: users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        lastLogin: u.lastLogin,
        loginCount: u.loginCount || 0,
        joinedAt: u.createdAt,
      })),
      total: users.length,
    });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/logout
router.post('/logout', (_req, res: Response): void => {
  res.json({ message: 'Logged out successfully' });
});

// GET /api/user/profile
router.get('/profile', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ user: { id: user._id, email: user.email, name: user.name } });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
