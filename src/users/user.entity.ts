import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Expose } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;
  @Column({ unique: true })
  @Expose()
  username: string;
  @Column()
  password: string;
  @Column({ unique: true })
  @Expose()
  email: string;
}
