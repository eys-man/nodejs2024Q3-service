import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger();

  constructor() {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, query, body } = req;

    res.on('finish', () => {
      const { statusCode } = res;

      const message = `[${method}] URL: ${originalUrl}:: ${statusCode} --- [Query: ${JSON.stringify(query)} :: Body: ${JSON.stringify(body)}]`;

      if (statusCode >= 500)
        this.logger.error(message);
      else if (statusCode >= 400)
        this.logger.warn(message);
      else
        this.logger.log(message)
    })

    next()
  }
}
