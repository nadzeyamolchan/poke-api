import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Pokemon } from './entities/pokemon.entity';
import { Type } from './entities/type.entity';
import { PokemonPageDTO } from './pagination/pokemonPageDTO';
import { PaginationResult } from './pagination/pagination-result';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
    @InjectRepository(Type)
    private readonly pokemonTypeRepository: Repository<Type>,
  ) {}

  private createFilterIdsQuery(
    filter: PokemonPageDTO,
  ): SelectQueryBuilder<any> {
    const query = this.pokemonRepository
      .createQueryBuilder('pokemon')
      .select('pokemon.id')
      .distinct(true)
      .innerJoin('pokemon.types', 'types');

    if (filter.name) {
      query.andWhere(`pokemon.name ILIKE :search`, {
        search: `%${filter.name}%`,
      });
    }

    if (filter.types && filter.types.length > 0) {
      query.andWhere(`types.name IN (:...types)`, {
        types: Array.isArray(filter.types)
          ? filter.types
          : Array.of(filter.types),
      });
    }

    return query.orderBy('pokemon.id');
  }

  public async filterPokemonByCriteriaPaginated(filter: PokemonPageDTO) {
    const filterIdsQuery = this.createFilterIdsQuery(filter);

    const count = await filterIdsQuery.getCount();

    const query = this.pokemonRepository
      .createQueryBuilder('pokemon')
      .leftJoinAndSelect('pokemon.types', 'type')
      .where(
        `pokemon.id in (${filterIdsQuery
          .limit(filter.limit)
          .offset(filter.offset)
          .getQuery()})`,
        filterIdsQuery.getParameters(),
      );

    const data = await query.orderBy('pokemon.id').getMany();

    return new PaginationResult({
      total: count,
      data: data,
    });
  }

  public async getAllPokemonTypes() {
    return await this.pokemonTypeRepository
      .createQueryBuilder('pokemonType')
      .getMany();
  }

  public async getPokemonById(id: number) {
    const pokemon = await this.pokemonRepository.findOne(id);
    if (!pokemon) {
      throw new NotFoundException(null, "Pokemon doesn't exist");
    }
    return pokemon;
  }
}
