export type ConnectionType = 'ssh' | 'vnc' | 'unknown';
export type ConnectionState = 'connected' | 'disconnected';
export class Connection {
  vmId: string;
  localPort: number;
  targetPort: number;
  type: ConnectionType;
  state: ConnectionState;
}
