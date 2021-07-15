import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Pokemon } from './pokemon.entity';

@Entity('types')
export class Type {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @ManyToMany(() => Pokemon, (pokemon: Pokemon) => pokemon.types)
  pokemon: Pokemon[];
}
