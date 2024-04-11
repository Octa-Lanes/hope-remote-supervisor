import { Injectable } from '@nestjs/common';
import { IClientPublishOptions, MqttClient } from 'mqtt';

@Injectable()
export class MqttService {
  constructor(private readonly client: MqttClient) {}

  public publish(
    topic: string,
    message: string,
    opts?: IClientPublishOptions,
    callback?: () => void,
  ): void {
    this.client.publish(topic, message, opts, callback);
  }
}
