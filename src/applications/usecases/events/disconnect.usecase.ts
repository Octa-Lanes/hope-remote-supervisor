import 'dotenv/config';

import { Injectable } from '@nestjs/common';
import { MqttService } from 'src/adapters/inbounds/mqtt/mqtt.service';
import { DisconnectCommand } from 'src/applications/commands/events/disconnect.command';
import { SSH_LOG_TOPIC } from 'src/commons/constants/topic.constant';
import {
  getConnectionType,
  getDeviceId,
} from 'src/commons/helpers/utils.helper';
import { Connection } from 'src/domain/connection';

@Injectable()
export class DisconnectUseCase {
  constructor(private readonly mqttService: MqttService) {}

  public async handle(command: DisconnectCommand) {
    const payload: Connection = {
      vmId: getDeviceId(),
      localPort: command.localPort,
      targetPort: command.targetPort,
      type: getConnectionType(command.localPort),
      state: 'disconnected',
    };

    console.log(SSH_LOG_TOPIC, payload);

    this.mqttService.publish(SSH_LOG_TOPIC, JSON.stringify(payload), {
      retain: false,
    });
  }
}
