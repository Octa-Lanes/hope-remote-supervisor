import { Injectable } from '@nestjs/common';
import { MqttClient } from 'mqtt';

@Injectable()
export class MqttService {
  constructor(private readonly client: MqttClient) {}

  public publish(topic: string, message: string) {
    this.client.publish(topic, message);
  }
}
