import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { LoggingService } from './logging/logging.service';
import { HttpExceptionsFilter } from './logging/exception-filter';
import { AuthGuard } from './auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const loggingService = app.get(LoggingService);
  const jwtService = app.get(JwtService);
  const reflector = app.get(Reflector);
  
  app.useLogger( loggingService );
  app.useGlobalGuards(new AuthGuard(jwtService, reflector));
  app.useGlobalFilters(new HttpExceptionsFilter(loggingService));

  process.on('uncaughtException', async (error) => {
    await loggingService.error(`Uncaught Exception: ${error.stack}`);
    console.error('Uncaught Exception:', error.stack);
  });

  process.on('unhandledRejection', async (reason) => {
    await loggingService.error(`Unhandled Rejection: ${JSON.stringify(reason)}`);
    console.error('Unhandled Rejection:', reason);

    await app.close();
    process.exit(1);
  });

  await app.listen(PORT);
}

bootstrap();
