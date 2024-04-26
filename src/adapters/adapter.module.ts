import 'dotenv/config';

import { Global, Module } from '@nestjs/common';
import { JournalModule } from 'src/adapters/inbounds/journal/journal.module';
import { MqttModule } from 'src/adapters/inbounds/mqtt/mqtt.module';

import { EventController } from './inbounds/controller/event.controller';

@Global()
@Module({
  imports: [
    MqttModule.forRootAsync({
      connection: process.env.MQTT_HOST,
    }),
    JournalModule.forRoot(),
  ],
  controllers: [EventController],
})
export class AdapterModule {}
