import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import axios from 'axios';

async function bootstrap() {
  axios.defaults.baseURL = 'https://pokeapi.co/api/v2/';

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
