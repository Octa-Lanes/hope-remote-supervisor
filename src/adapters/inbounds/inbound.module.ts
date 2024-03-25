import 'dotenv/config';

import { Module } from '@nestjs/common';
import { MqttModule } from 'src/adapters/inbounds/mqtt/mqtt.module';
import { SSH_LIVE_EXEC_TOPIC } from 'src/commons/constants/topic.constant';

@Module({
  imports: [
    MqttModule.forRoot({
      connection: process.env.MQTT_HOST,
      topics: [
        {
          topic: SSH_LIVE_EXEC_TOPIC,
          handler: (message) => console.log(message),
        },
      ],
    }),
  ],
})
export class InboundModule {}
