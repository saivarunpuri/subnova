import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expiryDate: Date;
  isActive: boolean;
  createdAt: Date;
}

const CouponSchema: Schema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);
