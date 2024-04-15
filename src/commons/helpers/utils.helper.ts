import 'dotenv/config';

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
  try {
    const pgrokConfigFile =
      process.env.PGROK_CONFIG || '~/.config/pgrok/pgrok.yml';
    const doc = load(readFileSync(pgrokConfigFile, 'utf8')) as PgrokConfig;
    return doc.vmId;
  } catch (error) {
    console.error('Loading PGROK_CONFIG failed', error);
  }
};

export const getConnectionType = (port: number): ConnectionType => {
  switch (port) {
    case 22:
      return 'ssh';
    case 5900:
      return 'vnc';
    default:
      return 'unknown';
  }
};
