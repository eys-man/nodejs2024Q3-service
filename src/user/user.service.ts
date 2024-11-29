import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  PartialUserDto,
  UpdatePasswordDto,
  UserDto,
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

    const user = await this.usersRepo.save(newUser);
    if (!user)
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    const partialUser = {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: Number(user.createdAt),
      updatedAt: Number(user.updatedAt),
    };

    return partialUser; // без пароля
  }

  async getAllUsers(): Promise<PartialUserDto[]> {
    return this.usersRepo.find({
      select: ['id', 'login', 'version', 'createdAt', 'updatedAt'],
    });
  }

  async getUserById(searchId: string): Promise<PartialUserDto> {
    // проверка на валидность id пользователя
    if (!validate(searchId))
      throw new HttpException('UserId is not uuid', HttpStatus.BAD_REQUEST);

    // поиск пользователя
    const user = await this.usersRepo.findOneBy({ id: searchId });
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

  async getUserByLogin(searchLogin: string): Promise<UserDto> {
    // поиск пользователя
    const user = await this.usersRepo.findOneBy({ login: searchLogin });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return user; // с паролем
  }

  async updateUser(
    searchId: string,
    updatePassword: UpdatePasswordDto,
  ): Promise<PartialUserDto> {
    // проверка на пустой dto
    if (Object.keys(updatePassword).length == 0)
      throw new HttpException('Invalid dto', HttpStatus.BAD_REQUEST);

    // проверка на валидность id пользователя
    if (!validate(searchId))
      throw new HttpException('UserId is not uuid', HttpStatus.BAD_REQUEST);

    // поиск пользователя
    const user = await this.usersRepo.findOneBy({ id: searchId });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    // сравнение паролей
    if (user.password !== updatePassword.oldPassword)
      throw new HttpException(
        'The password being replaced is incorrect',
        HttpStatus.FORBIDDEN,
      );

    user.password = updatePassword.newPassword;

    const updatedUser = await this.usersRepo.save(user);
    if (!updatedUser)
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    const partialUser: PartialUserDto = {
      id: updatedUser.id,
      login: updatedUser.login,
      version: updatedUser.version,
      createdAt: Number(updatedUser.createdAt),
      updatedAt: Number(updatedUser.updatedAt),
    };

    // return updatedUser;
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
