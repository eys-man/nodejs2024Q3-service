import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/users.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() user:CreateUserDto) {
    return await this.authService.signup(user);
  }


  @Post('login')
  async login(@Body() user: CreateUserDto) {
    return await this.authService.login(user);
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() refreshToken: string) {
    return await this.authService.refresh(refreshToken);
  }
}
