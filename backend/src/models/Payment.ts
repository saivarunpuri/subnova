import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  userId: string;
  bundleId: string;
  bundleTitle: string;
  screenshot: string;
  transactionId: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  ottUsername?: string;
  ottPassword?: string;
  couponCode?: string;
  discountAmount?: number;
  createdAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bundleId: { type: Schema.Types.ObjectId, ref: 'Pack', required: true },
    bundleTitle: { type: String, default: '' },
    screenshot: { type: String, required: true },
    transactionId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    ottUsername: { type: String, default: '' },
    ottPassword: { type: String, default: '' },
    couponCode: { type: String, default: '' },
    discountAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

