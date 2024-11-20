import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  PartialUserDto,
  UpdatePasswordDto,
} from './dto/users.dto';
import { validate } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  async createUser(newUser: CreateUserDto): Promise<PartialUserDto> {
    if (
      typeof newUser.login !== 'string' ||
      typeof newUser.password !== 'string'
    )
      throw new HttpException('Invalid initial data', HttpStatus.BAD_REQUEST);

    // const user: UserDto = {
    //   id: v4(),
    //   login: newUser.login,
    //   password: newUser.password,
    //   version: 1,
    //   createdAt: Date.now(),
    //   updatedAt: Date.now(),
    // };

    // users.push(user);
    const user = await this.usersRepo.save(newUser);

    const partialUser = {
      id: user.id,
      login: user.login,
      version: 1,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return partialUser; // без пароля
  }

  async getAllUsers(): Promise<PartialUserDto[]> {
    const partialUsers: PartialUserDto[] = [];
    const users = await this.usersRepo.find();

    users.forEach((i) => {
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

  async getUserById(searchId: string): Promise<PartialUserDto> {
    // проверка на валидность id пользователя
    if (!validate(searchId))
      throw new HttpException('UserId is not uuid', HttpStatus.BAD_REQUEST);

    // поиск пользователя
    const user = await this.usersRepo.findOne({ where: { id: searchId } });
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

  async updateUser(
    searchId: string,
    newPassword: UpdatePasswordDto,
  ): Promise<PartialUserDto> {
    // проверка на пустой dto
    if (Object.keys(newPassword).length == 0)
      throw new HttpException('Invalid dto', HttpStatus.BAD_REQUEST);

    // проверка на валидность id пользователя
    if (!validate(searchId))
      throw new HttpException('UserId is not uuid', HttpStatus.BAD_REQUEST);

    // поиск пользователя
    const user = await this.usersRepo.findOne({ where: { id: searchId } });
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

    await this.usersRepo.save(user);

    return partialUser; // без пароля
  }

  async deleteUser(searchId: string): Promise<PartialUserDto> {
    // проверка на валидность id пользователя
    if (!validate(searchId))
      throw new HttpException('UserId is not uuid', HttpStatus.BAD_REQUEST);

    // поиск пользователя
    const user = await this.getUserById(searchId);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const respUser: PartialUserDto = {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    await this.usersRepo.delete({ id: searchId });

    return respUser;
  }
}
