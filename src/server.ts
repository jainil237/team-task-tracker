import 'dotenv/config';
import { AppDataSource } from './config/database';
import app from './app';
import { env } from './config/env';

async function bootstrap() {
  try {
    await AppDataSource.initialize();

    console.log('Database connected successfully');

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);

    process.exit(1);
  }
}

bootstrap();