import mongoose, { Schema, Document } from 'mongoose';

export interface IOTTBrand extends Document {
  name: string;
  category: string;
  logo: string;
  description: string;
  createdAt: Date;
}

const OTTBrandSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    logo: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<IOTTBrand>('OTTBrand', OTTBrandSchema);
