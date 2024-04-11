import 'dotenv/config';

import { Injectable } from '@nestjs/common';
import { MadeConnectionCommand } from 'src/applications/commands/events/madeConnection.command';
import { writeConnectionLog } from 'src/commons/helpers/file.helper';
import {
  getConnectionType,
  getDeviceId,
} from 'src/commons/helpers/utils.helper';

@Injectable()
export class MadeConnectionUseCase {
  constructor() {}

  public async handle(command: MadeConnectionCommand) {
    const payload = {
      vmId: getDeviceId(),
      localPort: command.localPort,
      targetPort: command.targetPort,
      type: getConnectionType(command.localPort),
    };

    writeConnectionLog(payload);
  }
}
