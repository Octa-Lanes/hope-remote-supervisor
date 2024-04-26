import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { createWriteStream, WriteStream } from 'fs';
import * as path from 'path';
import { WriteLogPermanentCommand } from 'src/applications/commands/log/writeLogPermanent.command';

@Injectable()
export class WriteLogPermanentUseCase implements OnApplicationShutdown {
  private readonly logger = new Logger(WriteLogPermanentUseCase.name);

  private logStream: WriteStream;
  private logQueue: string[] = [];

  constructor() {
    const logFilePath = path.join(
      '/var/log/supervisor',
      `${new Date().getTime()}.log`,
    );
    this.logStream = createWriteStream(logFilePath, { flags: 'a' });
    this.setupStream();
  }

  onApplicationShutdown(signal?: string) {
    if (this.logStream) {
      this.logStream.end();
    }
  }

  private setupStream() {
    this.logStream.on('error', (error) => {
      this.logger.error('Error writing to log file:', error);
    });

    this.logStream.on('drain', () => {
      while (this.logQueue.length > 0) {
        const log = this.logQueue[0]; // Look at the first item without removing it
        const wrote = this.logStream.write(log);
        if (!wrote) {
          break; // Stop if the stream's buffer is full again
        }
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
      this.logger.error('Failed to write log:', error);
    }
  }
}
