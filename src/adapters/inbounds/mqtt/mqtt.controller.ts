import { Injectable } from '@nestjs/common';
import { MqttSubscribe } from 'src/commons/decorators/mqtt.decorator';

@Injectable()
export class MqttController {
  @MqttSubscribe('remote/target/12345/pgrok/ssh/live')
  async sshLive(message: string) {
    console.log(message);
  }
}
