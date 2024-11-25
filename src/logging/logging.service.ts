import {
    Injectable,
    LoggerService,
    LogLevel,
  } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import path from 'path';
  import fs from 'fs/promises';
  import 'dotenv/config';

  @Injectable()
  export class LoggingService implements LoggerService {
    private readonly logLevel: number;
    private readonly maxFileSize: number;
    private readonly logsDirectory: string;
    private readonly errorLogsFile: string;
    private readonly appLogsFile: string;
    private logPrefix: string;

    constructor(private readonly configService: ConfigService) {
      this.logLevel = this.configService.get('LOGS_LEVEL', 2);
      this.maxFileSize = this.configService.get('MAX_FILE_SIZE', 1024);
      this.logsDirectory = path.join(process.cwd(), 'logs');
      this.logPrefix = Date.now().toLocaleString();
      // this.errorLogsFile = path.join(this.logsDirectory, 'error.log');
      // this.appLogsFile = path.join(this.logsDirectory, 'app.log');
    }

    async error(message: string, trace?: string) {
      if (this.logLevel >= 0) {
        await this.writeLog('error', message, this.errorLogsFile, trace);
      }
    }

    async log(message: string) {
      if (this.logLevel >= 1) {
        await this.writeLog('log', message, this.appLogsFile);
      }
    }

    async warn(message: string) {
      if (this.logLevel >= 2) {
        await this.writeLog('warn', message, this.appLogsFile);
      }
    }

    async debug(message: string) {
      if (this.logLevel >= 3) {
        await this.writeLog('debug', message, this.appLogsFile);
      }
    }

    async verbose(message: string) {
      if (this.logLevel >= 4) {
        await this.writeLog('verbose', message, this.appLogsFile);
      }
    }

    private async writeLog(
      level: LogLevel,
      message: string,
      filePath: string,
      trace?: string,
    ) {
      const date = new Date().toISOString();
      const logMessage = `[${level.toUpperCase()}] ${date} => ${message}${
        trace ? ` - ${trace}` : ''
      }\n`;
  
      // асинхронная проверка на существование каталога, в конструкторе нельзя
      try {
        await fs.access(this.logsDirectory);
      } catch {
        try {
          await fs.mkdir(this.logsDirectory, { recursive: true });
        } catch (err) {
          console.log(err);
        }
      }

      // если файл переполнен, пишем новый
      await this.rotateFile(filePath, level);

      try {
        await fs.appendFile(filePath, logMessage, { flag: 'a+' });
      } catch (err) {
        console.log(err);
      }

      console.log(message);
    }

    private async rotateFile(filePath: string, level: LogLevel): Promise<string> {
      try {
        const state = await fs.stat(filePath);
              
        if (state.size / 1024 >= this.maxFileSize) {
          this.logPrefix = Date.now().toLocaleString();
          const newFilePath = this.getLogFilePath(level);
          try {
            await fs.rename(filePath, newFilePath);
          } catch (err) {
            console.log(err);
          }
          return newFilePath;
        }
      } catch (err) {
        console.log(err);
      }

      return filePath;
    }

    private getLogFilePath(level: LogLevel): string {
      const fileName = `${this.logPrefix}-${
        level === 'error' ? 'errors' : 'logs'
      }.log`;
      return path.resolve(this.logsDirectory, fileName);
    }
  }
