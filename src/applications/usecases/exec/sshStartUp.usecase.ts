import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import {
  SSH_LIVE_CMD,
  SSH_STARTUP_CMD,
} from 'src/commons/constants/command.constant';

@Injectable()
export class SshStartUpUseCase {
  private readonly logger = new Logger(SshStartUpUseCase.name);

  constructor() {}

  public async handle() {
    exec(SSH_LIVE_CMD, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      if (!stdout) return;

      const isLive = stdout.match(/pgrok tcp 22/);

      if (isLive) return;

      exec(SSH_STARTUP_CMD, (error, stdout, stderr) => {
        if (error) {
          this.logger.error(`exec error: ${error}`);
          return;
        }
        this.logger.log(`stdout: ${stdout}`);
        this.logger.log(`stderr: ${stderr}`);
      });
    });
  }
}
