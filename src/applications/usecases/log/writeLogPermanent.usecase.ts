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
  private logQueue: string[] = [];
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
      '/var/log/supervisor',
      `${new Date().getTime()}.log`,
    );
    this.logStream = createWriteStream(logFilePath, { flags: 'a' });
    this.setupStream();
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  setupRotation() {
    this.logStream.end();
    this.rotateLog();
  }

  private setupStream() {
    this.logStream.on('error', (error) => {
      this.logger.error('Error writing to log file:', error);
    });

    this.logStream.on('drain', () => {
      while (this.logQueue.length > 0) {
        const log = this.logQueue[0]; // Look at the first item without removing it
        const wrote = this.logStream.write(log);

        if (!wrote) break;
        this.logQueue.shift(); // Only remove the item if it was successfully written
      }
    });
  }

  public async handle(command: WriteLogPermanentCommand) {
    try {
      const wrote = this.logStream.write(command.payload);

      // in case writestream buffer is full
      if (!wrote) {
        this.logQueue.push(command.payload);
      }
    } catch (error) {
      this.logQueue.push(command.payload);
      this.logger.error('Failed to write log:', error);
    }
  }
}
