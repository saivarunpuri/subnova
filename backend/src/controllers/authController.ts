import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/generateToken';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, phoneNumber, password } = req.body; // In real app, password should be hashed

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const user = await User.create({
      name,
      email,
      phoneNumber,
      passwordHash: password, // Store hash in real world
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [
        { email: email },
        { name: email }
      ]
    });

    if (user && user.passwordHash === password) { // Use bcrypt.compare in production
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        role: user.role,
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
