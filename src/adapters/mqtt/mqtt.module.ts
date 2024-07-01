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
import { connect, connectAsync, MqttClient } from 'mqtt';
import { MqttController } from 'src/adapters/inbounds/controller/mqtt.controller';
import { MqttService } from 'src/adapters/mqtt/mqtt.service';
import { RootOption } from 'src/adapters/mqtt/rootOption.interface';
import { MQTT_HANDLER_METADATA_KEY } from 'src/commons/decorators/mqtt.decorator';

@Global()
@Module({})
export class MqttModule implements OnModuleInit {
  constructor(
    private readonly discoveryService: DiscoveryService,
    @Inject('MQTT_CLIENT') private readonly mqttClient: MqttClient,
  ) {}

  static async forRootAsync(option: RootOption): Promise<DynamicModule> {
    const logger = new Logger(MqttModule.name);

    try {
      logger.debug(`Connecting to MQTT Broker at ${option.brokerUrl}`);

      const client = await connectAsync(option.brokerUrl, {
        username: option.username,
        password: option.password,
        protocolVersion: 5,
      });

      logger.log(`Connected to MQTT server at ${option.brokerUrl}`);
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
      logger.error('Failed to connect to MQTT server', error);
    }
  }

  onModuleInit() {
    const logger = new Logger(MqttModule.name);
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
      logger.debug(`Received MQTT Topic: ${topic}\nBody:${message}`);
      if (handlers.has(topic)) handlers.get(topic)(topic, message.toString());
    });
  }
}
