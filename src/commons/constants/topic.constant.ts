import { getDeviceId } from 'src/commons/helpers/utils.helper';

const deviceId = getDeviceId();

export const SSH_LOG_TOPIC = `remote/target/${deviceId}/pgrok/ssh/log`;
export const SERVICE_EXEC_TOPIC = `remote/target/66221bdbef4b06f0f8278609/service/exec`;
export const VNC_LOG_TOPIC = `remote/target/${deviceId}/pgrok/vnc/log`;
export const VNC_EXEC_TOPIC = `remote/target/66221bdbef4b06f0f8278609/service/vnc/exec`;
export const MADE_CONNECTION_TOPIC = `remote/target/${deviceId}/pgrok/made-connection`;
export const DISCONNECT_TOPIC = `remote/target/${deviceId}/pgrok/disconnect`;
