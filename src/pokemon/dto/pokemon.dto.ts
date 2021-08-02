import { IsArray, IsNumber } from 'class-validator';
import { Type } from '../entities/type.entity';

export class PokemonDto {
  @IsNumber()
  id: number;
  name: string;
  weight: number;
  height: number;
  sprite: string;
  @IsArray()
  types: Type[];
}
