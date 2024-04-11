export type ConnectionType = 'ssh' | 'vnc' | 'unknown';
export class Connection {
  vmId: string;
  localPort: number;
  targetPort: number;
  type: ConnectionType;
}
