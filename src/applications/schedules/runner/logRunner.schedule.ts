import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import * as dayjs from 'dayjs';
import { readdirSync, rm, statSync } from 'fs';
import * as ms from 'milliseconds';
import * as path from 'path';
import { dateDiff } from 'src/commons/helpers/dayjs.helper';

@Injectable()
export class LogRunner {
  private logger = new Logger(LogRunner.name);

  constructor() {}

  @Cron('*/5 * * * *')
  public async log() {
    setTimeout(() => {
      this.uploadDirectory('/var/log/supervisor');
    }, ms.seconds(30));
  }

  async uploadDirectory(directoryPath: string) {
    const files = readdirSync(directoryPath);
    for (let file of files) {
      const filePath = path.join(directoryPath, file);
      const stats = statSync(filePath, { throwIfNoEntry: false });

      if (
        stats.isFile() &&
        dateDiff(dayjs().toDate(), stats.birthtime, 'second') >= 30 // file was created more than 30 seconds ago
      ) {
        rm(filePath, () => {});
      }
    }
  }
}
