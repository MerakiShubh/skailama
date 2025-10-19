import express from 'express';
const app = express();
import cors from 'cors';
import { config } from './config/config.js';

const corsOrigin = config.get('corsOrigin');
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

import userRoutes from './routes/user.routes.js';
import eventRoutes from './routes/event.routes.js';

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/events', eventRoutes);

export { app };
