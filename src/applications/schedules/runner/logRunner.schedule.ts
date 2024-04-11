import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MqttService } from 'src/adapters/inbounds/mqtt/mqtt.service';
import {
  SSH_LOG_TOPIC,
  VNC_LOG_TOPIC,
} from 'src/commons/constants/topic.constant';
import { readLastLog } from 'src/commons/helpers/file.helper';
import { pgrokSSHServiceStatus } from 'src/commons/helpers/systemd.helper';

@Injectable()
export class LogRunner {
  private readonly logger = new Logger(LogRunner.name);

  constructor(private readonly mqttService: MqttService) {}

  @Cron(CronExpression.EVERY_SECOND)
  public async ssh() {
    const status = await pgrokSSHServiceStatus();
    const payload = JSON.stringify({
      serviceType: 'ssh',
      log: (await readLastLog('ssh')) || {},
      systemCtlStatus: status,
    });
    this.mqttService.publish(SSH_LOG_TOPIC, payload, { retain: true });
  }

  @Cron(CronExpression.EVERY_SECOND)
  public async vnc() {
    const status = await pgrokSSHServiceStatus();
    const payload = JSON.stringify({
      serviceType: 'vnc',
      log: (await readLastLog('vnc')) || {},
      systemCtlStatus: status,
    });
    this.mqttService.publish(VNC_LOG_TOPIC, payload, { retain: true });
  }
}
