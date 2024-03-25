import { getDeviceId } from 'src/commons/helpers/utils';

const deviceId = getDeviceId();

export const SSH_LIVE_TOPIC = `remote/target/${deviceId}/pgrok/ssh/live`;
export const SSH_LIVE_EXEC_TOPIC = `remote/target/${deviceId}/pgrok/ssh/live/exec`;
