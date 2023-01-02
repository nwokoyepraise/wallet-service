import * as dotenv from "dotenv";
import {resolve} from "path";
dotenv.config({path: resolve(__dirname, "../.env")});
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";

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
}
bootstrap();
