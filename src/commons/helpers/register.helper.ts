import { Logger } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import axiosInstance from 'src/commons/config/axios.config';
import { getRawMachineId } from 'src/commons/helpers/utils.helper';

export const registerDevice = async (): Promise<boolean> => {
  const logger = new Logger(registerDevice.name);

  try {
    const machineId = getRawMachineId();
    const { data: registered } = await axiosInstance.post(
      'bo/v1/self-register',
      {
        machineId,
      },
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

    logger.log('Device registered successfully');
    return true;
  } catch (error) {
    logger.error(error);
    return false;
  }
};
