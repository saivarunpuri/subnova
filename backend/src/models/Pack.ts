import mongoose, { Schema, Document } from 'mongoose';

export interface IPack extends Document {
  brand: mongoose.Types.ObjectId;
  title: string;
  price: number;
  originalPrice: number;
  validity: string;
  features: string[];
  description: string;
  createdAt: Date;
}

const PackSchema: Schema = new Schema(
  {
    brand: { type: Schema.Types.ObjectId, ref: 'OTTBrand', required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    validity: { type: String, required: true },
    features: { type: [String], default: [] },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Pack || mongoose.model<IPack>('Pack', PackSchema);
