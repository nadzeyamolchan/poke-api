import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private static comparePasswords(password, confirmPassword) {
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords are not identical!');
    }
  }

  private async isUserExist(user) {
    const existingUSer = await this.userRepository.findOne({
      where: [{ username: user.userName }, { email: user.email }],
    });

    if (existingUSer) {
      throw new BadRequestException(['username or email is already taken']);
    }
  }

  public async createUser(userData) {
    UserService.comparePasswords(userData.password, userData.confirmPassword);
    this.isUserExist(userData);
    const user = new User({
      username: userData.userName,
      password: await this.authService.hashPassword(userData.password),
      email: userData.email,
    });
    await this.userRepository.save(user);
    return {
      user: user.username,
      token: this.authService.getTokenForUser(userData),
    };
  }
}
