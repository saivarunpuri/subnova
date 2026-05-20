import jwt from 'jsonwebtoken';

export const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secretkey', {
    expiresIn: '20m',
  });
};
