import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { createWriteStream, rename, renameSync, WriteStream } from 'fs';
import * as ms from 'milliseconds';
import * as path from 'path';
import { WriteLogPermanentCommand } from 'src/applications/commands/log/writeLogPermanent.command';

@Injectable()
export class WriteLogPermanentUseCase implements OnApplicationShutdown {
  private readonly logger = new Logger(WriteLogPermanentUseCase.name);
  private readonly logDir = process.env.TEMP_LOG_DIR || '/dev/shm/supervisor';
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
    const logFilePath = path.join(this.logDir, `temp.log`);
    this.logStream = createWriteStream(logFilePath, { flags: 'a' });
    this.setupStream();
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  setupRotation() {
    renameSync(
      path.join(this.logDir, 'temp.log'),
      path.join(
        this.logDir,
        `old-${new Date().getTime().toString().slice(0, -4)}.log`,
      ),
    );

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
