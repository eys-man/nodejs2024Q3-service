import { Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  PartialUserDto,
  UpdatePasswordDto,
  UserDto,
} from './dto/user.dto';
import { v4 } from 'uuid';

@Injectable()
export class UserService {
  private readonly users: UserDto[] = [];

  createUser(user: CreateUserDto): PartialUserDto {
    const newUser: UserDto = {
      id: v4(),
      login: user.login,
      password: user.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.push(newUser);
    const partialUser: PartialUserDto = { ...newUser };
    console.log(`create user: ${partialUser}`);

    return partialUser; // без пароля
  }

  getAllUsers(): CreateUserDto[] {
    return this.users;
  }

  getUserById(searchId: string): PartialUserDto | undefined {
    const user = this.users.find((i) => i.id === searchId);

    const partialUser: PartialUserDto = { ...user };
    console.log(`getUserById user: ${partialUser}`);

    return partialUser; // без пароля
  }

  updateUser(newPassword: UpdatePasswordDto): PartialUserDto {
    const user: UserDto = this.users.find(
      (i) => i.password === newPassword.oldPassword,
    );

    if (!user) return undefined;

    user.password = newPassword.newPassword;
    user.updatedAt = Date.now();
    user.version++;

    const partialUser: PartialUserDto = { ...user };

    return partialUser; // без пароля
  }

  deleteUser(searchId: string): boolean {
    const indexUser = this.users.findIndex((i) => i.id === searchId);
    if (indexUser) {
      this.users.splice(indexUser, 1);
      return true;
    }
    return false;
  }
}
