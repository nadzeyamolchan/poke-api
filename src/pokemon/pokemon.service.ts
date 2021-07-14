import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pokemon } from './pokemon.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Type } from './type.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
    @InjectRepository(Type)
    private readonly pokemonTypeRepository: Repository<Type>,
  ) {}
  private static addSearchCriteria(
    query: SelectQueryBuilder<any>,
    searchText: string,
  ): void {
    query.where(`pokemon.name ILIKE :search`, {
      search: `%${searchText}%`,
    });
  }

  private static addTypeCriteria(
    query: SelectQueryBuilder<any>,
    types: string[],
  ): void {
    query.andWhere(`pokemonTypes.name IN (:types)`, {
      types: types,
    });
  }

  public async getAllPokemon() {
    return await this.pokemonRepository
      .createQueryBuilder('pokemon')
      .leftJoinAndSelect('pokemon.types', 'types')
      .getMany();
  }

  public async getAllPokemonTypes() {
    return await this.pokemonTypeRepository
      .createQueryBuilder('pokemonType')
      .getMany();
  }

  public async petPokemonById(id: number) {
    const pokemon = await this.pokemonRepository.findOne(id);
    if (!pokemon) {
      throw new NotFoundException(null, "Pokemon doesn't exist");
    }
    return pokemon;
  }

  public async filterPokemonByCriteria(name: string, types: string[]) {
    const query = this.pokemonRepository
      .createQueryBuilder('pokemon')
      .leftJoinAndSelect('pokemon.types', 'pokemonTypes');

    if (name) {
      PokemonService.addSearchCriteria(query, name);
    }

    if (types && types.length > 0) {
      PokemonService.addTypeCriteria(query, types);
    }
    return await query.orderBy('pokemon.id').getMany();
  }
}
