import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  ValidationPipe,
  UsePipes,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdatePasswordDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  getAll() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdatePasswordDto,
  ) {
    return this.userService.updateUser(updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  removeUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
