import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

//keep awake
const keepAwake = () => {
  setInterval(async function () {
    await fetch('https://nwokoyepraise-lendsqr-be-test.onrender.com');
  }, 300000); // every 5 minutes (300000)
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      validateCustomDecorators: true,
    }),
  );

  await app.listen(3000);
  keepAwake()
}
bootstrap();
