import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { Pokemon } from './pokemon.entity';
import { PokemonService } from './pokemon.service';
import { UploadPokemonDto } from './data/upload-pokemon.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  async findAllPokemon() {
    return this.pokemonService.getAllPokemon();
  }

  @Get('/search')
  async searchPokemon(
    @Query('name') name: string,
    @Query('types') types: string[],
  ): Promise<Pokemon[]> {
    return this.pokemonService.filterPokemonByCriteria(name, types);
  }

  @Get('/type')
  async findAllPokemonTypes() {
    return this.pokemonService.getAllPokemonTypes();
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pokemonService.petPokemonById(id);
  }

  @Post()
  async uploadPokemon(@Body() data: UploadPokemonDto) {}
}
