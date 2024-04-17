import 'dotenv/config';

import { Injectable } from '@nestjs/common';
import { MqttService } from 'src/adapters/inbounds/mqtt/mqtt.service';
import { MadeConnectionCommand } from 'src/applications/commands/events/madeConnection.command';
import { SSH_LOG_TOPIC } from 'src/commons/constants/topic.constant';
import {
  getConnectionType,
  getDeviceId,
} from 'src/commons/helpers/utils.helper';
import { Connection } from 'src/domain/connection';

@Injectable()
export class MadeConnectionUseCase {
  constructor(private readonly mqttService: MqttService) {}

  public async handle(command: MadeConnectionCommand) {
    const payload: Connection = {
      vmId: getDeviceId(),
      localPort: command.localPort,
      targetPort: command.targetPort,
      type: getConnectionType(command.localPort),
      state: 'connected',
    };

    this.mqttService.publish(SSH_LOG_TOPIC, JSON.stringify(payload), {
      retain: false,
    });
  }
}
