import 'reflect-metadata';

import {
  DynamicModule,
  Global,
  Inject,
  Logger,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@nestjs/core';
import * as _ from 'lodash';
import { connect, MqttClient } from 'mqtt';
import { MqttController } from 'src/adapters/inbounds/controller/mqtt.controller';
import { MqttService } from 'src/adapters/inbounds/mqtt/mqtt.service';
import { RootOption } from 'src/adapters/inbounds/mqtt/rootOption.interface';
import { MQTT_HANDLER_METADATA_KEY } from 'src/commons/decorators/mqtt.decorator';

@Global()
@Module({})
export class MqttModule implements OnModuleInit {
  private readonly logger = new Logger(MqttModule.name);

  constructor(
    private readonly discoveryService: DiscoveryService,
    @Inject('MQTT_CLIENT') private readonly mqttClient: MqttClient,
  ) {}

  static forRoot(option: RootOption): DynamicModule {
    try {
      const client = connect(option.connection);

      console.log('Connected to mqtt');

      return {
        module: MqttModule,
        imports: [DiscoveryModule],
        providers: [
          MqttController,
          {
            provide: 'MQTT_CLIENT',
            useValue: client,
          },
          {
            provide: MqttService,
            useValue: new MqttService(client),
          },
        ],
        exports: ['MQTT_CLIENT', MqttController, MqttService],
      };
    } catch (error) {
      console.error('Fail to connect to mqtt');
    }
  }

  onModuleInit() {
    const mqttController = this.discoveryService
      .getProviders()
      .find((provider) => provider.name === MqttController.name);

    if (_.isEmpty(mqttController)) return;

    const instance = mqttController.instance;
    const prototype = Object.getPrototypeOf(instance);

    const methods = Object.getOwnPropertyNames(prototype).filter(
      (method) =>
        method !== 'constructor' && typeof instance[method] === 'function',
    );

    if (methods.length === 0) return;

    const handlers = new Map();

    methods.forEach((method) => {
      const metadata = Reflect.getMetadata(
        MQTT_HANDLER_METADATA_KEY,
        instance[method],
      );

      handlers.set(metadata, instance[method].bind(instance));
    });

    this.mqttClient.subscribe([...handlers.keys()]);
    this.mqttClient.on('message', (topic, message) => {
      if (handlers.has(topic)) handlers.get(topic)(topic, message.toString());
    });
  }
}
