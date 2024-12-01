import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
	imports: [
		UserModule,
		TypeOrmModule.forFeature([User]),
		JwtModule.register({
			global: true,
			secret: process.env.JWT_SECRET_KEY,
			signOptions: {expiresIn: process.env.TOKEN_EXPIRE_TIM}
		}),
	],
	controllers: [AuthController],
	providers: [
		UserService,
		AuthService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		}
	],
})
export class AuthModule {}
