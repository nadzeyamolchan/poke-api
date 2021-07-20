import { AbstractRepository, EntityRepository } from 'typeorm';
import { Pokemon } from './pokemon.entity';
import { PokemonDto } from '../dto/pokemon.dto';

@EntityRepository(Pokemon)
export class PokemonRepository extends AbstractRepository<Pokemon> {
  findByName(name: string) {
    return this.repository.find({ name });
  }
  createAndSave(data: PokemonDto) {
    const pokemonItem = new Pokemon();
    Object.assign(pokemonItem, data);
    this.repository.save(pokemonItem);
  }
}
