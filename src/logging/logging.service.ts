import {
  Injectable,
  LoggerService,
  LogLevel,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { resolve } from 'node:path';
import { appendFile, unlink, mkdir, access, stat } from 'fs/promises';

@Injectable()
export class LoggingService implements LoggerService {
  private readonly logLevel: number;
  private readonly maxFileSize: number;
  private readonly logsDirectory: string;
  private timeStamp: string;

  constructor(private readonly configService: ConfigService) {
    this.logLevel = this.configService.get('LOGS_LEVEL', 2);
    this.maxFileSize = this.configService.get('MAX_FILE_SIZE', 1024);
    this.timeStamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.logsDirectory = resolve( this.configService.get('LOGS_DIRECTORY') );
  }

  async error(message: string) {
    if (this.logLevel >= 1) {
      await this.writeLog('error', message, this.getLogFilePath('error'));
    }
  }

  async log(message: string) {
    if (this.logLevel >= 0) {
      await this.writeLog('log', message, this.getLogFilePath('log'));
    }
  }

  async warn(message: string) {
    if (this.logLevel >= 2) {
      await this.writeLog('warn', message, this.getLogFilePath('warn'));
    }
  }

  async debug(message: string) {
    if (this.logLevel >= 3) {
      await this.writeLog('debug', message, this.getLogFilePath('debug'));
    }
  }

  async verbose(message: string) {
    if (this.logLevel >= 4) {
      await this.writeLog('verbose', message, this.getLogFilePath('verbose'));
    }
  }

  private async writeLog(
    level: LogLevel,
    message: string,
    filePath: string,
  ) {
    const date = new Date().toISOString();
    const logMessage = `[${level.toUpperCase()}] ${date} : ${message}\n`;

    // асинхронная проверка на существование каталога, в конструкторе нельзя
    try {
      await access( this.logsDirectory);
    } catch {
      try {
        await mkdir(this.logsDirectory, { recursive: true });
      } catch (err) {
        console.log(`Не могу созать каталог ${this.logsDirectory}`);
      }
    }

    await this.rotateFile(filePath, level);

    try {
      await appendFile(filePath, logMessage, { flag: 'a+' });
    } catch (err) {
      console.log(`Не могу записать в файл ${filePath}`);
    }

    console.log(message);
  }

  private async rotateFile(filePath: string, level: LogLevel) {
    try {
      const state = await stat(filePath);

      if (state.size / 1024 >= this.maxFileSize) {
        // 
        this.timeStamp = new Date().toISOString().replace(/[:.]/g, '-');
        try {
          await unlink(filePath);
        } catch (err) {
          console.log(err);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  // абсолютный путь
  private getLogFilePath(level: LogLevel): string {
    const fileName = `${this.timeStamp}_${
      level === 'error' ? 'errors' : 'logs'
    }.log`;

    return resolve(this.logsDirectory, fileName);
  }
}
