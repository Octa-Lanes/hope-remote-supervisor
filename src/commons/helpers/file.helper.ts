import 'dotenv/config';

import * as csv from 'csvtojson';
import { appendFile } from 'fs';
import * as _ from 'lodash';
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
): Promise<(Connection & { timestamp: string }) | undefined> => {
  try {
    const jsonObj = await csv({ noheader: true }).fromFile(logFile(type));
    const lastObj = _.last(jsonObj);
    if (_.isEmpty(lastObj)) return undefined;
    const body = {
      timestamp: lastObj?.field1,
      vmId: lastObj?.field2,
      localPort: parseInt(lastObj?.field3),
      targetPort: parseInt(lastObj?.field4),
      type: lastObj?.field5,
      state: lastObj?.field6,
    };
    return body;
  } catch (error) {
    return undefined;
  }
};
