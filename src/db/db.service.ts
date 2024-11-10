import { Injectable } from '@nestjs/common';
import { UserDto } from '../user/dto/users.dto';

@Injectable()
export class DatabaseService {
  private users: UserDto[] = [];

  getUsers() {
    return this.users;
  }
}
