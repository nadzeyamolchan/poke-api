import { Column, Entity, ManyToMany, PrimaryColumn, JoinTable } from 'typeorm';
import { Type } from './type.entity';

@Entity('pokemon')
export class Pokemon {
  @PrimaryColumn()
  id: number;
  @Column({ unique: true })
  name: string;
  @Column()
  weight: number;
  @Column()
  height: number;
  @Column({ nullable: true })
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
