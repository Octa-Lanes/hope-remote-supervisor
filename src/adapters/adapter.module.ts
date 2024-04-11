import 'dotenv/config';

import { Global, Module } from '@nestjs/common';
import { MqttModule } from 'src/adapters/inbounds/mqtt/mqtt.module';
import { EventController } from './inbounds/controller/event.controller';

@Global()
@Module({
  imports: [
    MqttModule.forRoot({
      connection: process.env.MQTT_HOST,
    }),
  ],
  controllers: [EventController],
})
export class AdapterModule {}
