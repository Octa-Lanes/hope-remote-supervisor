import 'dotenv/config';

import { Injectable } from '@nestjs/common';
import { MqttService } from 'src/adapters/mqtt/mqtt.service';
import { MadeConnectionCommand } from 'src/applications/commands/events/madeConnection.command';
import { SERVICE_CONNECTION_TOPIC } from 'src/commons/constants/topic.constant';
import {
  getConnectionType,
  getRawMachineId,
} from 'src/commons/helpers/utils.helper';
import { Connection } from 'src/domain/connection';

@Injectable()
export class MadeConnectionUseCase {
  constructor(private readonly mqttService: MqttService) {}

  public async handle(command: MadeConnectionCommand) {
    const payload: Connection = {
      vmId: getRawMachineId(),
      localPort: command.localPort,
      targetPort: command.targetPort,
      type: getConnectionType(command.localPort),
      state: 'connected',
    };

    this.mqttService.publish(
      SERVICE_CONNECTION_TOPIC,
      JSON.stringify(payload),
      {
        retain: false,
      },
    );
  }
}
