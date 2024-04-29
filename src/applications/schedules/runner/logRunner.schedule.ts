import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import * as dayjs from 'dayjs';
import { readdirSync, readFileSync, rm, statSync } from 'fs';
import * as ms from 'milliseconds';
import * as path from 'path';
import axiosInstance from 'src/commons/config/axios.config';
import { dateDiff } from 'src/commons/helpers/dayjs.helper';
import { getDeviceId } from 'src/commons/helpers/utils.helper';

@Injectable()
export class LogRunner {
  private logger = new Logger(LogRunner.name);

  constructor() {}

  @Cron(CronExpression.EVERY_5_MINUTES)
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
        try {
          await axiosInstance.post(
            `bo/v1/vms/${getDeviceId()}/upload-logs`,
            {
              name: file,
              content: readFileSync(filePath),
            },
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          );
          rm(filePath, (error) => {
            if (error) this.logger.error(error);
          });
        } catch (error) {
          this.logger.error(error);
        }
      }
    }
  }
}
