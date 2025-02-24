import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({ 
      whitelist: true,           
      forbidNonWhitelisted: true, 
      transform: true,           
    }),
  );

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000; 

  await app.listen(Number(port));
  console.log(`Server running on http://localhost:${port}`);
}
bootstrap();
