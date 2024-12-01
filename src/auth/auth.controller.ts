import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/users.dto';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signup(@Body() user: CreateUserDto) {
    console.log(`SingUp controller`);
    return await this.authService.signup(user);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() user: CreateUserDto) {
    console.log(`Login controller`);
    return await this.authService.login(user);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshToken: string) {
    console.log(`Refresh controller`);
    return await this.authService.refresh(refreshToken);
  }
}
