import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { Pokemon } from './pokemon.entity';

@Entity('types')
export class Type {
  @PrimaryColumn()
  id: number;
  @Column({ unique: true })
  name: string;
  @ManyToMany(() => Pokemon, (pokemon) => pokemon.types)
  pokemon: Pokemon[];
}
