import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import axios from 'axios';


//TODO add JWT strategy to every open endpoint

async function bootstrap() {
  axios.defaults.baseURL = 'https://pokeapi.co/api/v2/';

  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
