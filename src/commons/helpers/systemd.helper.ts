import { systemBus } from 'dbus-next';

export const manageService = async (
  type: string,
  cmd: string,
): Promise<void> => {
  const managerCmd = cmd === 'startup' ? 'StartUnit' : 'StopUnit';

  const bus = systemBus();
  const serviceNameDBUS = 'org.freedesktop.systemd1';
  const objectPath = '/org/freedesktop/systemd1';
  const interfaceName = 'org.freedesktop.systemd1.Manager';

  try {
    const object = await bus.getProxyObject(serviceNameDBUS, objectPath);
    const manager = object.getInterface(interfaceName);
    await manager[managerCmd](`pgrok-${type}.service`, 'replace');
    console.log(`pgrok-${type}.service ${cmd} successfully.`);
  } catch (error) {
    console.error(`Error ${cmd} pgrok-${type}.service:`, error);
  } finally {
    bus.disconnect();
  }
};
