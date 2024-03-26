import { getDeviceId } from 'src/commons/helpers/utils.helper';

const deviceId = getDeviceId();

export const SSH_LIVE_TOPIC = `remote/target/${deviceId}/pgrok/ssh/live`;
export const SSH_EXEC_TOPIC = `remote/target/${deviceId}/pgrok/ssh/exec`;
