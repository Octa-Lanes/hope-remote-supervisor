import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import * as dayjs from 'dayjs';
import { readdirSync, rm, statSync } from 'fs';
import * as ms from 'milliseconds';
import * as path from 'path';
import { dateDiff } from 'src/commons/helpers/dayjs.helper';

@Injectable()
export class LogRunner {
  private logger = new Logger(LogRunner.name);

  constructor() {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async log() {
    setTimeout(() => {
      this.uploadFrom(process.env.TEMP_LOG_DIR || '/dev/shm/supervisor');
    }, 0);
  }

  async uploadFrom(directoryPath: string) {
    const files = readdirSync(directoryPath);
    for (let file of files) {
      const filePath = path.join(directoryPath, file);

      if (file !== 'temp.log') {
        // rm(filePath, (error) => {
        //   if (error) this.logger.error(error);
        // });
        this.logger.debug(`Deleted ${filePath}`);
      }
    }
  }
}
