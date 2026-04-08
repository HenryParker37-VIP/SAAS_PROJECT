import mongoose, { Document, Schema } from 'mongoose';

export interface ILoginActivity extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  ipAddress: string;
  loginAt: Date;
}

const loginActivitySchema = new Schema<ILoginActivity>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  userEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  ipAddress: {
    type: String,
    default: 'unknown',
  },
  loginAt: {
    type: Date,
    default: Date.now,
  },
});

loginActivitySchema.index({ loginAt: -1 });

export default mongoose.model<ILoginActivity>('LoginActivity', loginActivitySchema);
