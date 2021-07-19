import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
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
      console.log('Loaded pokemon with name: ', res.data.name);
      return { name: res.data.name };
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

  public async getAllPokemon() {
    const pokemonArray = await this.getPokemonNames();
    pokemonArray.forEach(
      (
        pokemon, //refactor to plain "for" function. Incorrect /pokeapi.co server answer
      ) =>
        this.getPokemonByName(pokemon.name).then((data) => console.log(data)),
    );
  }
}
