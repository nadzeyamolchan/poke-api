import {
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonPageDTO } from './pagination/pokemonPageDTO';

@Controller('pokemon')
export class PokemonController {
  private readonly logger = new Logger(PokemonController.name);
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  async findAllPokemon() {
    return this.pokemonService.getAllPokemon();
  }

  @Get('/search')
  async getPokemonPage(@Query() filter: PokemonPageDTO) {
    this.logger.debug(filter);
    return this.pokemonService.filterPokemonByCriteriaPaginated(filter);
  }

  @Get('/type')
  async findAllPokemonTypes() {
    return this.pokemonService.getAllPokemonTypes();
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pokemonService.petPokemonById(id);
  }
}
