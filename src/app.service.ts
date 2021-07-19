import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { getRepository } from 'typeorm';
import { Pokemon } from './pokemon/entities/pokemon.entity';
import { Type } from './pokemon/entities/type.entity';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  public getAllPokemonTypes(): Promise<any> {
    return axios.get('/type').then((res) => {
      const pokemonTypes = res.data.results.map((item) => item.name);
      return pokemonTypes.map((item, index) => {
        return { id: index + 1, name: item };
      });
    });
  }

  private getAllPokemonCount(): Promise<any> {
    return axios
      .get('/pokemon', {
        params: {
          limit: 1,
          offset: 0,
        },
      })
      .then((res) => res.data.count);
  }

  private getPokemonByName(name): Promise<any> {
    return axios.get(`/pokemon/${name}`).then((res) => {
      return {
        id: res.data.id,
        name: res.data.name,
        weight: res.data.weight,
        height: res.data.height,
        sprite: res.data.sprites.other['official-artwork']['front_default'],
        types: res.data.types.map((item) => item.type).map((type) => type.name),
      };
    });
  }

  private async getPokemonNames(): Promise<any> {
    return axios
      .get('/pokemon', {
        params: {
          limit: await this.getAllPokemonCount(),
          offset: 0,
        },
      })
      .then((res) => res.data.results);
  }

  public async getAllPokemon(): Promise<any> {
    const pokemonArray = await this.getPokemonNames();
    let count = 0;
    for (let i = 0; i < 25; i++) {
      const { height, id, name, sprite, types, weight } =
        await this.getPokemonByName(pokemonArray[i].name);
      const pokemonRepository = getRepository(Pokemon);
      const typesRepository = getRepository(Type);
      const currentPokemon = await pokemonRepository.find({
        name: name,
      });

      const currentPokemonTypes = await typesRepository
        .createQueryBuilder('types')
        .where('types.name IN (:...pokemonTypes)', { pokemonTypes: types })
        .getMany();

      if (currentPokemon.length === 0) {
        const pokemonItem = new Pokemon();
        pokemonItem.types = currentPokemonTypes;
        pokemonItem.name = name;
        pokemonItem.id = id;
        pokemonItem.sprite = sprite;
        pokemonItem.weight = weight;
        pokemonItem.height = height;
        await pokemonRepository.save(pokemonItem);
        count++;
      }
    }
    this.logger.debug(`${count} pokemon has been loaded`);
  }
}
