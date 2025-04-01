import { Logger } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import axiosInstance from 'src/commons/config/axios.config';
import { getRawMachineId } from 'src/commons/helpers/utils.helper';

const registerDevice = async (): Promise<boolean> => {
  const logger = new Logger(registerDevice.name);

  try {
    const machineId = getRawMachineId();

    logger.debug(`Registering with ID: ${machineId}...`);

    const { data } = await axiosInstance.post('supervisor/v1/self-register', {
      machineId,
    });

    const configLocation =
      process.env.PGROK_CONFIG || '/root/.config/pgrok/pgrok.yml';

    writeFileSync(
      configLocation,
      dump({
        remote_addr: process.env.PGROK_SERVER_URL,
        server_addr: process.env.SERVER_URL,
        forward_addr: '',
        token: data.data.key,
        vmId: data.data.id,
      }),
    );

    logger.log('Device registered successfully');
    return true;
  } catch (error) {
    logger.error(error);
    return false;
  }
};

export const initDevice = async () => {
  let registered = false;

  const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  while (!registered) {
    registered = await registerDevice();
    if (!registered) {
      await sleep(10000); // 10 seconds delay
    }
  }

  return null;
};
