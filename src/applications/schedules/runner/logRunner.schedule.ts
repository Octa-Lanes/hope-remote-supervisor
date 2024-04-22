import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MqttService } from 'src/adapters/inbounds/mqtt/mqtt.service';
import { PULSE_TOPIC } from 'src/commons/constants/topic.constant';

@Injectable()
export class LogRunner {
  private readonly logger = new Logger(LogRunner.name);

  constructor(private readonly mqttService: MqttService) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  public async pulse() {
    this.mqttService.publish(PULSE_TOPIC, '1', { retain: false });
  }
}
