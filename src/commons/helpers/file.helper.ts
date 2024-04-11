import 'dotenv/config';

import csv from 'csvtojson';
import { appendFile } from 'fs';
import { Connection, ConnectionType } from 'src/domain/connection';

const logFile = (type: ConnectionType) => `src/logs/${type}-log.csv`;
export const writeConnectionLog = (connection: Connection): Promise<void> => {
  const data = `${new Date().getTime()},${connection.vmId},${connection.localPort},${connection.targetPort},${connection.type},${connection.state}\n`;
  return new Promise((resolve, reject) => {
    appendFile(logFile(connection.type), data, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

export const readLastLog = async (
  type: ConnectionType,
): Promise<Connection> => {
  const jsonObj = await csv().fromFile(logFile(type));
  return jsonObj[jsonObj.length - 1] as Connection;
};
