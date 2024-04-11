import { getDeviceId } from 'src/commons/helpers/utils.helper';

const deviceId = getDeviceId();

export const SSH_LIVE_TOPIC = `remote/target/${deviceId}/pgrok/ssh/live`;
export const SSH_EXEC_TOPIC = `remote/target/${deviceId}/pgrok/ssh/exec`;
export const MADE_CONNECTION_TOPIC = `remote/target/${deviceId}/pgrok/made-connection`;
export const DISCONNECT_TOPIC = `remote/target/${deviceId}/pgrok/disconnect`;
