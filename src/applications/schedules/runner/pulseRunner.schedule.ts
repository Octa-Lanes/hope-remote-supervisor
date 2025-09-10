import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MqttService } from 'src/adapters/mqtt/mqtt.service';
import {
  PULSE_TOPIC,
  PULSE_TOPIC_ORIGINAL,
} from 'src/commons/constants/topic.constant';
import { calculateJitter } from 'src/commons/helpers/utils.helper';

@Injectable()
export class PulseRunner {
  private readonly logger = new Logger(PulseRunner.name);
  constructor(private readonly mqttService: MqttService) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  public async pulse() {
    const jitterDelay = calculateJitter(0, 1000, 15 * 1000);

    setTimeout(() => {
      this.mqttService.publish(
        PULSE_TOPIC,
        JSON.stringify({
          originalTopic: PULSE_TOPIC_ORIGINAL,
        }),
        { retain: false },
        () => {
          this.logger.debug(`Published to ${PULSE_TOPIC}`);
        },
      );
    }, jitterDelay);
  }
}
