import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      id: 1,
      username: 'john123',
      password: '123',
      email: 'john@test.com',
      firstname: 'John',
      lastname: 'Smith',
    },
    {
      id: 2,
      username: 'tom123',
      password: 'password123',
      email: 'tom@test.com',
      firstname: 'Tom',
      lastname: 'Smith',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
