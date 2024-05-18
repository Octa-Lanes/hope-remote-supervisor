import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as FormData from 'form-data';
import { createReadStream, readdirSync, rm } from 'fs';
import * as path from 'path';
import axiosInstance from 'src/commons/config/axios.config';
import { getRawMachineId } from 'src/commons/helpers/utils.helper';

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
          const formData = new FormData();
          const fileStream = createReadStream(filePath);
          formData.append('files', fileStream, file);

          await axiosInstance.post(
            `supervisor/v1/${getRawMachineId()}/upload-logs`,
            formData,
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
