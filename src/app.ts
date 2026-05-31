import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.route';
import "reflect-metadata";
import projectRoutes from "./routes/project.route";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/auth', authRoutes);
app.use("/projects", projectRoutes);

app.use((err: any, _req: any, res: any, _next: any) => {
  const message = err?.message ?? 'Internal Server Error';

  if (message === 'EMAIL_ALREADY_EXISTS') {
    return res.status(409).json({ message: 'Email already exists' });
  }

  if (message === 'INVALID_CREDENTIALS') {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (message === 'INVALID_REFRESH_TOKEN') {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  return res.status(500).json({ message: 'Internal Server Error' });
});

export default app;