import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pokemon } from './pokemon.entity';
import { Repository } from 'typeorm';
import { Type } from './type.entity';

@Controller('pokemon')
export class PokemonController {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
    @InjectRepository(Type)
    private readonly pokemonTypeRepository: Repository<Type>,
  ) {}

  @Get()
  async findAllPokemon() {
    return await this.pokemonRepository
      .createQueryBuilder('pokemon')
      .leftJoinAndSelect('pokemon.types', 'types')
      .getMany();
  }

  @Get('/search?')
  async searchPokemon(@Query('name') name: string): Promise<Pokemon[]> {
    return await this.pokemonRepository
      .createQueryBuilder('pokemon')
      .leftJoinAndSelect('pokemon.types', 'types')
      .where(`pokemon.name ILIKE :search`, {
        search: `%${name}%`,
      })
      .orderBy('pokemon.id')
      .getMany();
  }

  @Get('/type')
  async findAllPokemonTypes() {
    return await this.pokemonTypeRepository
      .createQueryBuilder('pokemonType')
      .getMany();
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const pokemon = await this.pokemonRepository.findOne(id);
    if (!pokemon) {
      throw new NotFoundException(null, "Pokemon doesn't exist");
    }
    return pokemon;
  }
}
