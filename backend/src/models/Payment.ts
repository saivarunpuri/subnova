import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  userId: string;
  bundleId: string;
  screenshot: string;
  transactionId: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bundleId: { type: Schema.Types.ObjectId, ref: 'Bundle', required: true },
    screenshot: { type: String, required: true },
    transactionId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>('Payment', PaymentSchema);
