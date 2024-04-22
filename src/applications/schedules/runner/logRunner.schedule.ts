import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MqttService } from 'src/adapters/inbounds/mqtt/mqtt.service';
import { PULSE_TOPIC } from 'src/commons/constants/topic.constant';

@Injectable()
export class LogRunner implements OnModuleInit {
  private readonly logger = new Logger(LogRunner.name);

  constructor(private readonly mqttService: MqttService) {}

  onModuleInit() {
    console.log('log runner pulse started');
    this.mqttService.publish(PULSE_TOPIC, '1', { retain: false });
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  public async pulse() {
    this.mqttService.publish(PULSE_TOPIC, '1', { retain: false });
  }
}
