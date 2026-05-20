import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  paymentQrUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema: Schema = new Schema(
  {
    paymentQrUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<ISettings>('Settings', SettingsSchema);
