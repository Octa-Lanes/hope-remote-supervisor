import 'dotenv/config';

import { Module } from '@nestjs/common';
import { MqttModule } from 'src/adapters/inbounds/mqtt/mqtt.module';

@Module({
  imports: [
    MqttModule.forRoot({
      connection: process.env.MQTT_HOST,
    }),
  ],
})
export class InboundModule {}
