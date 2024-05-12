import { getRawMachineId } from 'src/commons/helpers/utils.helper';

const deviceId = getRawMachineId();

export const SERVICE_CONNECTION_TOPIC = `remote/target/${deviceId}/service/connection`;
export const SERVICE_CONNECTION_TOPIC_ORIGINAL = `remote/target/+/service/connection`;
export const SERVICE_EXEC_TOPIC = `remote/target/${deviceId}/service/exec`;
export const PULSE_TOPIC = `remote/target/${deviceId}/pulse`;
export const PULSE_TOPIC_ORIGINAL = `remote/target/+/pulse`;
