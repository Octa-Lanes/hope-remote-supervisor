import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MqttService } from 'src/adapters/inbounds/mqtt/mqtt.service';

@Injectable()
export class LiveSchedule {
  private readonly logger = new Logger(LiveSchedule.name);

  constructor(private readonly mqttService: MqttService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  public pgrokSshLive() {}
}
