import 'dotenv/config';

import csv from 'csvtojson';
import { appendFile } from 'fs';
import { Connection } from 'src/domain/connection';

const logFile = 'src/logs/connection-log.csv';
export const writeConnectionLog = (connection: Connection): Promise<void> => {
  const data = `${new Date()},${connection.vmId},${connection.localPort},${connection.targetPort},${connection.type}\n`;
  return new Promise((resolve, reject) => {
    appendFile(logFile, data, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

export const readLastLog = async (): Promise<Connection> => {
  const jsonObj = await csv().fromFile(logFile);
  return jsonObj[jsonObj.length - 1] as Connection;
};
