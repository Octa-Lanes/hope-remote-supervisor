import 'dotenv/config';

import { Global, Module } from '@nestjs/common';
import { JournalModule } from 'src/adapters/journal/journal.module';
import { MqttModule } from 'src/adapters/mqtt/mqtt.module';

import { EventController } from './inbounds/controller/event.controller';

@Global()
@Module({
  imports: [
    MqttModule.forRootAsync({
      brokerUrl: process.env.MQTT_BROKER,
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
    }),
    JournalModule.forRoot(),
  ],
  controllers: [EventController],
})
export class AdapterModule {}
