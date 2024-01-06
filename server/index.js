import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.js';
import videoRoutes from './routes/video.js';
import commentRoutes from './routes/comment.js';
import authRoutes from './routes/auth.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
dotenv.config();

const connect = () => {
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log('Connected to DB');
    })
    .catch((err) => {
      throw err;
    });
};

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);

app.listen(8800, () => {
  connect();
  console.log('Server working');
});
