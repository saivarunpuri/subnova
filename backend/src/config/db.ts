import mongoose from 'mongoose';
import { seedDefaultData } from '../utils/seeder';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ottbundle');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Seed default channels and packages
    seedDefaultData();
  } catch (error: any) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ Backend is running without a database connection. Some features will fail, but the server will stay up.');
    // process.exit(1);
  }
};
