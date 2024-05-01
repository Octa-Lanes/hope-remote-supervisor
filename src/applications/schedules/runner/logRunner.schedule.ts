import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as FormData from 'form-data';
import { createReadStream, readdirSync, rm } from 'fs';
import * as path from 'path';
import axiosInstance from 'src/commons/config/axios.config';
import { getDeviceId } from 'src/commons/helpers/utils.helper';

@Injectable()
export class LogRunner {
  private logger = new Logger(LogRunner.name);

  constructor() {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  public async log() {
    setTimeout(() => {
      this.logger.debug('Log Runner Invoked');
      this.uploadFrom(process.env.TEMP_LOG_DIR || '/dev/shm/supervisor');
    }, 0);
  }

  async uploadFrom(directoryPath: string) {
    const files = readdirSync(directoryPath);
    this.logger.debug('Log file count: ' + (files.length - 1));

    for (let file of files) {
      const filePath = path.join(directoryPath, file);

      if (file !== 'temp.log') {
        try {
          const formData = new FormData();
          const fileStream = createReadStream(filePath);
          formData.append('files', fileStream, file);

          const result = await axiosInstance.post(
            `bo/v1/vms/${getDeviceId()}/upload-logs`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          );
          this.logger.debug(result.data);
          rm(filePath, (error) => {
            if (error) this.logger.error(error);
            this.logger.debug(`Deleted ${filePath}`);
          });
        } catch (error) {
          this.logger.error(error);
        }
      }
    }
  }
}
