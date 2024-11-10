import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  PartialUserDto,
  UpdatePasswordDto,
  UserDto,
} from './dto/users.dto';
import { DatabaseService } from '../db/db.service';
import { v4, validate } from 'uuid';

@Injectable()
export class UserService {
  // private readonly users: UserDto[] = [];
  private users = this.databaseService.getUsers();

  constructor(private readonly databaseService: DatabaseService) {}

  createUser(newUser: CreateUserDto): PartialUserDto {
    if (
      typeof newUser.login !== 'string' ||
      typeof newUser.password !== 'string'
    )
      throw new HttpException('Invalid initial data', HttpStatus.BAD_REQUEST);

    const user: UserDto = {
      id: v4(),
      login: newUser.login,
      password: newUser.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.push(user);

    const partialUser = {
      id: user.id,
      login: user.login,
      version: 1,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return partialUser; // без пароля
  }

  getAllUsers(): PartialUserDto[] {
    const partialUsers: PartialUserDto[] = [];
    this.users.forEach((i) => {
      partialUsers.push({
        id: i.id,
        login: i.login,
        version: i.version,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
      });
    });
    return partialUsers; // вывести без пароля
  }

  getUserById(searchId: string): PartialUserDto | undefined {
    // проверка на валидность id пользователя
    if (!validate(searchId))
      throw new HttpException('UserId is not uuid', HttpStatus.BAD_REQUEST);

    // поиск пользователя
    const user = this.users.find((i) => i.id === searchId);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const partialUser: PartialUserDto = {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return partialUser; // без пароля
  }

  updateUser(searchId: string, newPassword: UpdatePasswordDto): PartialUserDto {
    // проверка на пустой dto
    if (Object.keys(newPassword).length == 0)
      throw new HttpException('Invalid dto', HttpStatus.BAD_REQUEST);

    // проверка на валидность id пользователя
    if (!validate(searchId))
      throw new HttpException('UserId is not uuid', HttpStatus.BAD_REQUEST);

    // поиск пользователя
    const user = this.users.find((i) => i.id === searchId);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    // сравнение паролей
    if (user.password !== newPassword.oldPassword)
      throw new HttpException(
        'The password being replaced is incorrect',
        HttpStatus.FORBIDDEN,
      );

    user.password = newPassword.newPassword;
    user.updatedAt = Date.now();
    user.version++;

    const partialUser: PartialUserDto = {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return partialUser; // без пароля
  }

  deleteUser(searchId: string): PartialUserDto {
    // проверка на валидность id пользователя
    if (!validate(searchId))
      throw new HttpException('UserId is not uuid', HttpStatus.BAD_REQUEST);

    // поиск пользователя
    const deletedUser = this.users.find((i) => i.id === searchId);
    const indexUser = this.users.findIndex((i) => i.id === searchId);
    if (indexUser === -1)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const respUser: PartialUserDto = {
      id: deletedUser.id,
      login: deletedUser.login,
      version: deletedUser.version,
      createdAt: deletedUser.createdAt,
      updatedAt: deletedUser.updatedAt,
    };

    this.users.splice(indexUser, 1); // удалить из базы

    return respUser;
  }
}
