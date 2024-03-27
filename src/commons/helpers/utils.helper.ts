import 'dotenv/config';

import { readFileSync } from 'fs';
import { load } from 'js-yaml';

interface PgrokConfig {
  remote_addr: string;
  forward_addr: string;
  token: string;
}

const pgrokConfigFile = process.env.PGROK_CONFIG || "~/.config/pgrok/pgork.yml"
const doc = load(readFileSync(pgrokConfigFile, "utf8")) as PgrokConfig;

export const getDeviceId = (): string => {
  return doc.token;
};
