import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import bundleRoutes from './routes/bundleRoutes';
import paymentRoutes from './routes/paymentRoutes';
import ottRoutes from './routes/ottRoutes';
import settingsRoutes from './routes/settingsRoutes';
import couponRoutes from './routes/couponRoutes';
import path from 'path';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // To be restricted in production
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(morgan('dev'));

// Connect to DB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bundles', bundleRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ott', ottRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/coupons', couponRoutes);

// Statically serve the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
  res.send('OTTBUNDLE API is running...');
});

// Socket.io integration for BUNDI AI
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  socket.on('bundi_message', (data) => {
    // Process BUNDI assistant messages
    console.log('Received BUNDI message:', data);
    socket.emit('bundi_reply', { message: 'I am BUNDI! How can I help you explore the Subscription Universe?' });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
