import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './input/create.user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = new User();

    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException(['Passwords are not identical!']);
    }

    const existingUSer = await this.userRepository.findOne({
      where: [
        { username: createUserDto.userName },
        { email: createUserDto.email },
      ],
    });

    if (existingUSer) {
      throw new BadRequestException(['username or email is already taken']);
    }

    user.username = createUserDto.userName;
    user.password = await this.authService.hashPassword(createUserDto.password);
    user.email = createUserDto.email;

    return {
      ...(await this.userRepository.save(user)),
      token: this.authService.getTokenForUser(user),
    };
  }
}
