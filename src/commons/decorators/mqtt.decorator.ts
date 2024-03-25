import { SetMetadata } from '@nestjs/common';

export const MQTT_HANDLER_METADATA_KEY = 'mqtt-handler-metadata-key';
export const MqttSubscribe = (topic: string) =>
  SetMetadata(MQTT_HANDLER_METADATA_KEY, topic);
