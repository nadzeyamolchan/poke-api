import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { map, Observable } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    private httpService: HttpService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  public getAllPokemonTypes(): Observable<Array<string>> {
    return this.httpService.get('/type').pipe(
      map((res: AxiosResponse) => {
        const pokemonTypes = res.data.results.map((item) => item.name);
        return pokemonTypes.map((item, index) => {
          return { id: index + 1, name: item };
        });
      }),
    );
  }
}
