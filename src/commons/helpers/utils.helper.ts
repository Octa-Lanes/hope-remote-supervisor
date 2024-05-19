import 'dotenv/config';

import { Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { ConnectionType } from 'src/domain/connection';

interface PgrokConfig {
  remote_addr: string;
  forward_addr: string;
  token: string;
  vmId: string;
}

export const getDeviceId = (): string => {
  const logger = new Logger(getDeviceId.name);

  try {
    const pgrokConfigFile =
      process.env.PGROK_CONFIG || '/root/.config/pgrok/pgrok.yml';
    const doc = load(readFileSync(pgrokConfigFile, 'utf8')) as PgrokConfig;
    return doc.vmId;
  } catch (error) {
    logger.error(error);
  }
};

export const getRawMachineId = (): string => {
  const path =
    process.env.MACHINE_INFO_PATH || '/etc/supervisor/machine-info.json';
  try {
    const configFile = JSON.parse(readFileSync(path, 'utf-8'));

    if (!configFile['serialNumber'])
      throw new Error('serialNumber not found at ' + path);
    return configFile['serialNumber'];
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export const getConnectionType = (port: number): ConnectionType => {
  let type: ConnectionType = 'unknown';
  switch (port) {
    case 22:
      type = 'ssh';
      break;
    case 5900:
      type = 'vnc';
      break;
    default:
      break;
  }

  return type;
};
