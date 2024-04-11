import 'dotenv/config';

import { Injectable } from '@nestjs/common';
import { DisconnectCommand } from 'src/applications/commands/events/disconnect.command';
import { writeConnectionLog } from 'src/commons/helpers/file.helper';
import {
  getConnectionType,
  getDeviceId,
} from 'src/commons/helpers/utils.helper';
import { Connection } from 'src/domain/connection';

@Injectable()
export class DisconnectUseCase {
  constructor() {}

  public async handle(command: DisconnectCommand) {
    const payload: Connection = {
      vmId: getDeviceId(),
      localPort: command.localPort,
      targetPort: command.targetPort,
      type: getConnectionType(command.localPort),
      state: 'disconnected',
    };

    writeConnectionLog(payload);
  }
}
