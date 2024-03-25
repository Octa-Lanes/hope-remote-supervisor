import { Global, Module } from '@nestjs/common';
import { MqttModule } from 'src/adapters/inbounds/mqtt/mqtt.module';

@Global()
@Module({
  imports: [
    MqttModule.forRoot({
      connection: process.env.MQTT_HOST,
    }),
  ],
})
export class AdapterModule {}
