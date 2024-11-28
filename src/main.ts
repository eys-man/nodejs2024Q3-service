import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { LoggingService } from './logging/logging.service';
import { HttpExceptionsFilter } from './logging/exception-filter';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const loggingService = app.get(LoggingService);
  app.useLogger( loggingService );
  app.useGlobalFilters(new HttpExceptionsFilter(loggingService));

  process.on('uncaughtException', async (error) => {
    await loggingService.error(`Caught exception: ${error} Exception origin: ${error.stack}`);
    // console.error('Uncaught Exception:', error.stack);
  });

  process.on('unhandledRejection', async (reason, p: Promise<any>) => {
    await loggingService.error(`Unhandled Rejection at: ${p}, reason: ${reason}`);
    // console.error('Unhandled Rejection:', reason);
  });

  await app.listen(PORT);
}

bootstrap();
