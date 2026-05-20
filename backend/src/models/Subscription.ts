import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  userId: string;
  bundleId: string;
  activatedAt: Date;
  expiresAt: Date;
}

const SubscriptionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bundleId: { type: Schema.Types.ObjectId, ref: 'Bundle', required: true },
    activatedAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
