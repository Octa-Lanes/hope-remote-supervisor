import { Injectable } from '@nestjs/common';
import { ServiceExecCommand } from 'src/applications/commands/services/serviceExec.command';
import { manageService } from 'src/commons/helpers/systemd.helper';

@Injectable()
export class ServiceExecUseCase {
  constructor() {}

  public async handle(command: ServiceExecCommand) {
    await manageService(command.type, command.cmd);
  }
}
