import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { getCustomRepository, getRepository } from 'typeorm';
import { Type } from './pokemon/entities/type.entity';
import { PokemonRepository } from './pokemon/entities/pokemon.repository';
import { PokemonDto } from './pokemon/dto/pokemon.dto';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  private getAllPokemonTypes(): Promise<void> {
    const typesRepository = getRepository(Type);
    return axios.get('/type').then((res) => {
      const pokemonTypes = res.data.results.map((item) => item.name);
      return pokemonTypes.map((item, index) => {
        if (!typesRepository.find({ name: item })) {
          const typeItem = new Type();
          typeItem.id = index + 1;
          typeItem.name = item;
          typesRepository.save(typeItem);
        }
      });
    });
  }

  private static getAllPokemonCount(): Promise<number> {
    return axios
      .get('/pokemon', {
        params: {
          limit: 1,
          offset: 0,
        },
      })
      .then((res) => res.data.count);
  }

  private getPokemonByName(name): Promise<PokemonDto> {
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
          limit: await AppService.getAllPokemonCount(),
          offset: 0,
        },
      })
      .then((res) => res.data.results);
  }

  private async getAllPokemon(): Promise<any> {
    const pokemonArray = await this.getPokemonNames();
    let count = 0;
    for (let i = 0; i < pokemonArray.length; i++) {
      const { height, id, name, sprite, types, weight } =
        await this.getPokemonByName(pokemonArray[i].name);
      const pokemonRepository = getCustomRepository(PokemonRepository);
      const typesRepository = getRepository(Type);
      const currentPokemon = await pokemonRepository.findByName(name);

      const currentPokemonTypes = await typesRepository
        .createQueryBuilder('types')
        .where('types.name IN (:...pokemonTypes)', { pokemonTypes: types })
        .getMany();

      if (currentPokemon.length === 0) {
        pokemonRepository.createAndSave({
          id: id,
          name: name,
          sprite: sprite,
          types: currentPokemonTypes,
          weight: weight,
          height: height,
        });
        console.log(`Pokemon ${i + 1} loaded`);
        count++;
      }
    }
    this.logger.debug(`${count} pokemon has been loaded`);
  }

  public async syncPokemonData(): Promise<void> {
    await this.getAllPokemonTypes();
    await this.getAllPokemon();
  }
}
