import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;
  @Column({ unique: true })
  @Expose()
  username: string;
  @Column()
  @Exclude()
  password: string;
  @Column({ unique: true })
  @Expose()
  email: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
