import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pokemon } from './entities/pokemon.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Type } from './entities/type.entity';
import { PokemonList } from './pagination/pokemon.list';
import { PaginationResult } from './pagination/pagination-result';

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

  public async filterPokemonByCriteriaPaginated(filter: PokemonList) {
    const query = this.pokemonRepository
      .createQueryBuilder('pokemon')
      .leftJoinAndSelect('pokemon.types', 'pokemonTypes');

    if (filter.name) {
      PokemonService.addSearchCriteria(query, filter.name);
    }

    if (filter.types.length) {
      PokemonService.addTypeCriteria(query, filter.types);
    }
    const data = await query
      .take(filter.limit)
      .skip(filter.offset)
      .orderBy('pokemon.id')
      .getMany();

    const count = await query.getCount();

    return new PaginationResult({
      total: count,
      data: data,
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
}
