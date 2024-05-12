import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import axiosInstance from 'src/commons/config/axios.config';
import { getRawMachineId } from 'src/commons/helpers/utils.helper';

@Injectable()
export class SelfRegisterUseCase implements OnModuleInit {
  private readonly logger = new Logger(SelfRegisterUseCase.name);

  constructor() {}

  async onModuleInit() {
    try {
      const machineId = getRawMachineId();
      const { data: registered } = await axiosInstance.post(
        'bo/v1/self-register',
        { machineId },
      );

      const configLocation =
        process.env.PGROK_CONFIG || '/root/.config/pgrok/pgrok.yml';

      writeFileSync(
        configLocation,
        dump({
          remote_addr: '54.251.68.117:2222',
          server_addr: 'https://test-api-hope-remote.8lanes.co',
          forward_addr: '',
          token: registered.key,
          vmId: registered.id,
        }),
      );

      this.logger.log('Device registered successfully');
    } catch (error) {
      this.logger.error(error);
    }
  }
}
