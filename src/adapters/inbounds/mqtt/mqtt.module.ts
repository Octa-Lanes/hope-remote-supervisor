import { DynamicModule, Module } from '@nestjs/common';
import { connect } from 'mqtt';
import { RootOption } from 'src/adapters/inbounds/mqtt/rootOption.interface';

@Module({})
export class MqttModule {
  static forRoot(option: RootOption): DynamicModule {
    try {
      const client = connect(option.connection);
      const handlerMap = new Map();

      console.info('MQTT Adapter is connected to', option.connection);

      option.topics.forEach(({ topic, handler }) => {
        client.subscribe(topic);
        console.info('MQTT Adapter subscribed to', topic);
        handlerMap.set(topic, handler);
      });

      client.on('message', (topic, message) => {
        handlerMap.get(topic)(message.toString());
      });

      return { module: MqttModule };
    } catch (error) {
      console.error('MQTT Adapter connection error');
      console.error(error);
    }
  }
}
