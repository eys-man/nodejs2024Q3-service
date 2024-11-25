import {
    ConsoleLogger,
    ConsoleLoggerOptions,
    Injectable,
  } from '@nestjs/common';
  import { join, resolve } from 'node:path';
  import 'dotenv/config';

  @Injectable()
  export class LoggingService extends ConsoleLogger {
    constructor(
      context: string,
      options: ConsoleLoggerOptions,
      private readonly logLevel: number = Number(process.env.LOG_LEVEL),
      private readonly maxFileSizeKB: number = Number(process.env.MAX_LOG_SIZE_KB),
      private logPrefix: number = Date.now(),
      private readonly logDirectory: string = join(process.cwd(), 'logs'),
    ) {
      super();
      this.setContext(context);
      this.setLogLevels(['log', 'error', 'warn', 'debug', 'verbose']);
    }

    log(message: string, context?: string) {
      super.log('log', message, context);
    }

    error(message: string, context?: string) {
      super.error('error', message, context);
    }

    warn(message: string, context?: string) {
     super.warn('warn', message, context);
    }

    debug(message: string, context?: string) {
      super.debug('debug', message, context);
    }

    verbose(message: string, context?: string) {
      super.verbose('verbose', message, context);
    }
  }
