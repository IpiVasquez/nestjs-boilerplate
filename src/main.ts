// Dotenv config
import { config } from 'dotenv';
config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { Logger } from '@/common';
import { port } from '@/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: new Logger(),
  });
  await app.listen(port);
}

bootstrap();
