import mongoose, { Document, Schema } from 'mongoose';

export interface IDashboardData extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  product: string;
  revenue: number;
  region: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  customerName: string;
  quantity: number;
  createdAt: Date;
}

const dashboardDataSchema = new Schema<IDashboardData>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    product: {
      type: String,
      required: true,
      enum: ['Analytics Pro', 'Cloud Storage', 'API Gateway', 'Auth Service', 'Data Pipeline'],
    },
    revenue: {
      type: Number,
      required: true,
    },
    region: {
      type: String,
      required: true,
      enum: ['North America', 'Europe', 'Asia'],
    },
    status: {
      type: String,
      required: true,
      enum: ['completed', 'pending', 'failed'],
    },
    description: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { timestamps: true }
);

dashboardDataSchema.index({ userId: 1, date: -1 });
dashboardDataSchema.index({ userId: 1, product: 1 });
dashboardDataSchema.index({ userId: 1, region: 1 });

export default mongoose.model<IDashboardData>('DashboardData', dashboardDataSchema);
