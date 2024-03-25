import { Injectable } from '@nestjs/common';
import { SshShutdownUseCase } from 'src/applications/usecases/exec/sshShutdown.usecase';
import { SshStartUpUseCase } from 'src/applications/usecases/exec/sshStartUp.usecase';
import { SSH_EXEC_TOPIC } from 'src/commons/constants/topic.constant';
import { MqttSubscribe } from 'src/commons/decorators/mqtt.decorator';

@Injectable()
export class MqttController {
  constructor(
    private readonly sshStartUpUseCase: SshStartUpUseCase,
    private readonly sshShutdownUseCase: SshShutdownUseCase,
  ) {}

  @MqttSubscribe(SSH_EXEC_TOPIC)
  async sshExec(message: string) {
    switch (message) {
      case 'startup':
        this.sshStartUpUseCase.handle();
        break;
      case 'shutdown':
        this.sshShutdownUseCase.handle();
        break;
      default:
    }
  }
}
