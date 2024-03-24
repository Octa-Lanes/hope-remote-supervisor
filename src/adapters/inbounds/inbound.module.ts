import { Module } from '@nestjs/common';
import { MqttModule } from 'src/modules/mqtt/mqtt.module';

@Module({
  imports: [
    MqttModule.forRoot({
      connection: 'mqtt://localhost:1883',
      topics: [
        {
          topic: 'test',
          handler: (message) => console.log(message),
        },
      ],
    }),
  ],
})
export class InboundModule {}
