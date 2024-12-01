import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    // const token = this.extractTokenFromHeader(request);

    const token = request.url.includes('/auth/refresh')
    ? request.body?.refreshToken
    : this.extractTokenFromHeader(request);

    if (!token) {
      throw new HttpException('', HttpStatus.UNAUTHORIZED);
    }
    try {
      const secret = request.url.includes('/auth/refresh')
        ? process.env.JWT_SECRET_REFRESH_KEY
        : process.env.JWT_SECRET;

      const payload = await this.jwtService.verifyAsync(token, { secret });
      request['user'] = payload;
    } catch {
      throw new HttpException('', HttpStatus.UNAUTHORIZED);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
