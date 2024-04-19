import { Injectable } from '@nestjs/common';
import { ServiceExecUseCase } from 'src/applications/usecases/exec/serviceExec.usecase';
import { SERVICE_EXEC_TOPIC } from 'src/commons/constants/topic.constant';
import { MqttSubscribe } from 'src/commons/decorators/mqtt.decorator';

@Injectable()
export class MqttController {
  constructor(private readonly serviceExec: ServiceExecUseCase) {}

  @MqttSubscribe(SERVICE_EXEC_TOPIC)
  async sshExec(topic: string, message: string) {
    const { type, cmd } = JSON.parse(message);
    console.log(topic, message);

    await this.serviceExec.handle({ cmd, type });
  }
}
