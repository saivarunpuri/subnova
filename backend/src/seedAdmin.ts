import mongoose from 'mongoose';
import User from './models/User';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
  try {
    const uri = process.env.MONGO_URI || '';
    if (!uri) throw new Error('No MONGO_URI');
    
    await mongoose.connect(uri);
    
    const existingAdmin = await User.findOne({ email: 'varundevlops' });
    if (existingAdmin) {
      console.log('Admin already exists!');
      process.exit(0);
    }

    await User.create({
      name: 'Admin Varun',
      email: 'varundevlops', // using email field for username
      passwordHash: 'password', // in real life, hash this!
      role: 'admin'
    });

    console.log('Admin user seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
