import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import axios from 'axios';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  axios.defaults.baseURL = 'https://pokeapi.co/api/v2/';

  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
