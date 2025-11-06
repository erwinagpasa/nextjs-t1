import { Injectable } from '@nestjs/common';
import { User } from './user.model';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      bio: 'Software developer',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      bio: 'Product manager',
    },
  ];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }
}
