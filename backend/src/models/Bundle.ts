import mongoose, { Schema, Document } from 'mongoose';

export interface IBundle extends Document {
  title: string;
  category: string;
  apps: string[];
  bundlePrice: number;
  originalPrice: number;
  createdAt: Date;
}

const BundleSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    apps: { type: [String], required: true },
    bundlePrice: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBundle>('Bundle', BundleSchema);
