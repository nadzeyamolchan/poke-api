import { IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @Length(5)
  userName: string;
  @Length(8)
  password: string;
  @Length(8)
  confirmPassword: string;
  @IsEmail()
  email: string;
}
