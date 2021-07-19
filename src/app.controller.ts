import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/sync')
  async getPokemonTypes(): Promise<any> {
    return this.appService.getAllPokemonTypes();
  }
  @Get('/pokesync')
  async getPokemon(): Promise<any> {
    const test = await this.appService.getAllPokemon();
    return test;
  }
}
