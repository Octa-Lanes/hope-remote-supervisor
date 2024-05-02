import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as dayjs from 'dayjs';
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  rename,
  renameSync,
  WriteStream,
} from 'fs';
import * as ms from 'milliseconds';
import * as path from 'path';
import { WriteLogPermanentCommand } from 'src/applications/commands/log/writeLogPermanent.command';

@Injectable()
export class WriteLogPermanentUseCase implements OnApplicationShutdown {
  private readonly logger = new Logger(WriteLogPermanentUseCase.name);
  private readonly logDir = process.env.TEMP_LOG_DIR || '/dev/shm/supervisor';
  private logStream: WriteStream;
  private logInterval: ReturnType<typeof setInterval>;
  private isStreamOpen = false;

  constructor() {
    this.rotateLog();
  }

  onApplicationShutdown(signal?: string) {
    if (this.logStream) {
      this.logStream.end();
      this.logInterval.unref();
    }
  }

  private rotateLog() {
    if (!existsSync(this.logDir)) {
      mkdirSync(this.logDir);
    }

    const logFilePath = path.join(this.logDir, `temp.log`);
    this.logStream = createWriteStream(logFilePath, { flags: 'a' });
    this.logStream.on('error', (error) => {
      this.logger.error('Error writing to log file:', error);
    });
    this.logStream.on('open', () => {
      this.isStreamOpen = true;
    });
    this.logStream.on('close', () => {
      this.isStreamOpen = false;
    });
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  setupRotation() {
    try {
      renameSync(
        path.join(this.logDir, 'temp.log'),
        path.join(
          this.logDir,
          `${dayjs().subtract(5, 'minutes').toDate().getTime()}.log`,
        ),
      );
    } catch (error) {
      this.logger.error(error);
    }
    this.logStream.end();
    this.rotateLog();
  }

  public async handle(command: WriteLogPermanentCommand) {
    try {
      if (this.isStreamOpen) this.logStream.write(command.payload);
    } catch (error) {
      this.logger.error('Failed to write log:', error);
    }
  }
}
