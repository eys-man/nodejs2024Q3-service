import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class PartialUserDto {
  @IsUUID()
  id: string; // uuid v4
  @IsString()
  @IsNotEmpty()
  login: string;
  @IsNumber()
  version: number; // integer number, increments on update
  @IsNumber()
  createdAt: number; // timestamp of creation
  @IsNumber()
  updatedAt: number; // timestamp of last update
}

export class UserDto extends PartialUserDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  login: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string; // previous password
  @IsString()
  @IsNotEmpty()
  newPassword: string; // new password
}
