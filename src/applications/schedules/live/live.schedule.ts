import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { exec } from 'child_process';
import { MqttService } from 'src/adapters/inbounds/mqtt/mqtt.service';
import { SSH_LIVE_CMD } from 'src/commons/constants/command.constant';
import { SSH_LIVE_TOPIC } from 'src/commons/constants/topic.constant';

@Injectable()
export class LiveSchedule {
  private readonly logger = new Logger(LiveSchedule.name);

  constructor(private readonly mqttService: MqttService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  public pgrokSshLive() {
    exec(SSH_LIVE_CMD, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      if (!stdout) return;

      const isLive = stdout.match(/pgrok tcp 22/);
      if (isLive) {
        this.mqttService.publish(SSH_LIVE_TOPIC, '1');
      } else {
        this.mqttService.publish(SSH_LIVE_TOPIC, '0');
      }
    });
  }
}
