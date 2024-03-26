import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MqttService } from 'src/adapters/inbounds/mqtt/mqtt.service';
import { SSH_LIVE_TOPIC } from 'src/commons/constants/topic.constant';
import { pgrokSSHServiceStatus } from 'src/commons/helpers/systemd.helper';

@Injectable()
export class LiveSchedule {
  private readonly logger = new Logger(LiveSchedule.name);

  constructor(private readonly mqttService: MqttService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async pgrokSshLive() {
    const status = await pgrokSSHServiceStatus();
    this.mqttService.publish(SSH_LIVE_TOPIC, status ? '1' : '0');
  }
}
