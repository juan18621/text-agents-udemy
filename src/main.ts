import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //npm install class-validator class-transformer
  //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
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.enableCors();

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
