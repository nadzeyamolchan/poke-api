import {
  Controller,
  Post,
  UseGuards,
  Get,
  SerializeOptions,
  UseInterceptors,
  ClassSerializerInterceptor,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { AuthGuardLocal } from './guards/auth-guard.local';
import { AuthGuardJwt } from './guards/auth-guard.jwt';
import { CreateUserDto } from './input/create.user.dto';
import { UserService } from './user.service';

@Controller('')
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @Post('auth')
  @UseGuards(AuthGuardLocal)
  async login(@CurrentUser() user: User) {
    return {
      userId: user.id,
      token: this.authService.getTokenForUser(user),
    };
  }

  @Post('/users')
  async createUser(@Body(new ValidationPipe()) userDto: CreateUserDto) {
    return this.userService.createUser(userDto);
  }

  @Get('profile')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async getProfile(@CurrentUser() user: User) {
    return user;
  }
}
