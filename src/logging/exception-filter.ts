import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggingService } from './logging.service';

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggingService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString().replace(/[:.]/g, '-'),
      path: request.url,
    };

    await this.logger.error(
      `Exception: ${JSON.stringify(errorResponse)} - Message: ${exception instanceof Error ? exception.message : ''}`,
    );

    response.status(status).json(errorResponse);
  }
}
