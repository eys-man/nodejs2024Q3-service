import {
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/users.dto';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(data: CreateUserDto) {
    const hashedPassword = await hash(data.password, Number(process.env.CRYPT_SALT));
    data.password = hashedPassword;
    const user = await this.userService.createUser(data);
    const { id, login } = user;

    return {
      id: user.id,
      // login: user.login,
      accessToken: await this.jwtService.signAsync(
        { userId: id, login },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: process.env.TOKEN_EXPIRE_TIME,
        },
      ),
      refreshToken: await this.jwtService.signAsync(
        { userId: id, login },
        {
          secret: process.env.JWT_SECRET_REFRESH_KEY,
          expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
        },
      ),
    };
  }

  async login({ login, password }: CreateUserDto) {
    const user = await this.userService.getUserByLogin(login);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.FORBIDDEN);
    }

    return {
      // id: user.login,
      // login: user.login,
      accessToken: await this.jwtService.signAsync(
        { userId: user.id, login },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: process.env.TOKEN_EXPIRE_TIME,
        },
      ),
      refreshToken: await this.jwtService.signAsync(
        { userId: user.id, login },
        {
          secret: process.env.JWT_SECRET_REFRESH_KEY,
          expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
        },
      ),
    };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken)
      throw new HttpException('No refresh token provided', HttpStatus.UNAUTHORIZED);

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });

      return {
        id: payload.login,
        login: payload.login,
        accessToken: await this.jwtService.signAsync(
          { userId: payload.id, login: payload.login },
          {
            secret: process.env.JWT_SECRET_KEY,
            expiresIn: process.env.TOKEN_EXPIRE_TIME,
          },
        ),
        refreshToken: await this.jwtService.signAsync(
          { userId: payload.id, login: payload.login },
          {
            secret: process.env.JWT_SECRET_REFRESH_KEY,
            expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
          },
        ),
      };
    } catch (error) {
      if (error instanceof TokenExpiredError)
        throw new HttpException('Refresh token has expired', StatusCodes.FORBIDDEN);
      throw new HttpException('Invalid refresh token', StatusCodes.FORBIDDEN);
    }

  }
}
