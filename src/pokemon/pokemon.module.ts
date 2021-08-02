import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import { Pokemon } from './entities/pokemon.entity';
import { Type } from './entities/type.entity';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Pokemon, Type])],
  controllers: [PokemonController],
  providers: [PokemonService],
})
export class PokemonModule {}
