import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private logger: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, query, body } = req;

    res.on('finish', async () => {
      const { statusCode } = res;

      const message = `[${method}] URL: ${originalUrl} -- Status Code: ${statusCode} -- [Query: ${JSON.stringify(query)} :: Body: ${JSON.stringify(body)}]`;

      if (statusCode >= 500)
        await this.logger.error(message);
      else if (statusCode >= 400)
        await this.logger.warn(message);
      else
        await this.logger.log(message)
    })

    next();
  }
}
