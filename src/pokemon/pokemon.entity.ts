import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
import { Type } from './type.entity';

@Entity('pokemon')
export class Pokemon {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  weight: number;
  @Column()
  height: number;
  @Column()
  sprite: string;
  @ManyToMany(() => Type, (type: Type) => type.pokemon, { cascade: true })
  @JoinTable({
    name: 'pokemon_types',
    joinColumn: {
      name: 'pokemon_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'type_id',
      referencedColumnName: 'id',
    },
  })
  types: Type[];
}
