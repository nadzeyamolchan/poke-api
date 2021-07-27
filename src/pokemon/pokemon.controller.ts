import {
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonPageDTO } from './pagination/pokemonPageDTO';
import { AuthGuardJwt } from '../auth/guards/auth-guard.jwt';

@Controller('pokemon')
export class PokemonController {
  private readonly logger = new Logger(PokemonController.name);
  constructor(private readonly pokemonService: PokemonService) {}

  @UseGuards(AuthGuardJwt)
  @Get('/search')
  async getPokemonPage(@Query() filter: PokemonPageDTO) {
    this.logger.debug(filter);
    return this.pokemonService.filterPokemonByCriteriaPaginated(filter);
  }

  @UseGuards(AuthGuardJwt)
  @Get('/type')
  async findAllPokemonTypes() {
    return this.pokemonService.getAllPokemonTypes();
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pokemonService.petPokemonById(id);
  }
}
