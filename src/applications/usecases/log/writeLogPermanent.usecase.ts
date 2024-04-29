import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { createWriteStream, WriteStream } from 'fs';
import * as ms from 'milliseconds';
import * as path from 'path';
import { WriteLogPermanentCommand } from 'src/applications/commands/log/writeLogPermanent.command';

@Injectable()
export class WriteLogPermanentUseCase implements OnApplicationShutdown {
  private readonly logger = new Logger(WriteLogPermanentUseCase.name);
  private logStream: WriteStream;
  private logInterval: ReturnType<typeof setInterval>;

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
    const logFilePath = path.join(
      process.env.TEMP_LOG_DIR || '/dev/shm/supervisor',
      `${new Date().getTime()}.log`,
    );
    this.logStream = createWriteStream(logFilePath, { flags: 'a' });
    this.setupStream();
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  setupRotation() {
    this.logStream.end();
    this.rotateLog();
  }

  private setupStream() {
    this.logStream.on('error', (error) => {
      this.logger.error('Error writing to log file:', error);
    });
  }

  public async handle(command: WriteLogPermanentCommand) {
    try {
      this.logStream.write(command.payload);
    } catch (error) {
      this.logger.error('Failed to write log:', error);
    }
  }
}
