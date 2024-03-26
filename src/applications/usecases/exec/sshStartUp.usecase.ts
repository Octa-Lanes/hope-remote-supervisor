import { Injectable, Logger } from '@nestjs/common';
import {
  pgrokSSHServiceStatus,
  startPgrokSSHService,
} from 'src/commons/helpers/systemd.helper';

@Injectable()
export class SshStartUpUseCase {
  private readonly logger = new Logger(SshStartUpUseCase.name);

  constructor() {}

  public async handle() {
    const status = await pgrokSSHServiceStatus();

    if (status) return;

    await startPgrokSSHService();
  }
}
