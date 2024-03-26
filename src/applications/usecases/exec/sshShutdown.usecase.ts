import { Injectable, Logger } from '@nestjs/common';
import {
  pgrokSSHServiceStatus,
  stopPgrokSSHService,
} from 'src/commons/helpers/systemd.helper';

@Injectable()
export class SshShutdownUseCase {
  private readonly logger = new Logger(SshShutdownUseCase.name);

  constructor() {}

  public async handle() {
    const status = await pgrokSSHServiceStatus();

    if (!status) return;

    await stopPgrokSSHService();
  }
}
