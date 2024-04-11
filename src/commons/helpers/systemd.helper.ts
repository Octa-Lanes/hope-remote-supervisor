import { systemBus } from 'dbus-next';

export const pgrokSSHServiceStatus = async (): Promise<boolean> => {
  return;
  const bus = systemBus();
  const serviceNameDBUS = 'org.freedesktop.systemd1';
  const objectPath = `/org/freedesktop/systemd1/unit/pgrok_2dssh_2eservice`;
  const interfaceName = 'org.freedesktop.DBus.Properties';

  try {
    const object = await bus.getProxyObject(serviceNameDBUS, objectPath);
    const properties = object.getInterface(interfaceName);
    const activeState = await properties.Get(
      'org.freedesktop.systemd1.Unit',
      'ActiveState',
    );

    const status: 'active' | 'inactive' = activeState.value;
    return status === 'active';
  } catch (error) {
    console.error('Error:', error);
  } finally {
    bus.disconnect();
  }
};

export const startPgrokSSHService = async (): Promise<void> => {
  const bus = systemBus();
  const serviceNameDBUS = 'org.freedesktop.systemd1';
  const objectPath = '/org/freedesktop/systemd1';
  const interfaceName = 'org.freedesktop.systemd1.Manager';

  try {
    const object = await bus.getProxyObject(serviceNameDBUS, objectPath);
    const manager = object.getInterface(interfaceName);
    await manager.StartUnit('pgrok-ssh.service', 'replace');
    console.log('pgrok-ssh.service started successfully.');
  } catch (error) {
    console.error('Error starting pgrok-ssh.service:', error);
  } finally {
    bus.disconnect();
  }
};

export const stopPgrokSSHService = async (): Promise<void> => {
  const bus = systemBus();
  const serviceNameDBUS = 'org.freedesktop.systemd1';
  const objectPath = '/org/freedesktop/systemd1';
  const interfaceName = 'org.freedesktop.systemd1.Manager';

  try {
    const object = await bus.getProxyObject(serviceNameDBUS, objectPath);
    const manager = object.getInterface(interfaceName);
    await manager.StopUnit('pgrok-ssh.service', 'replace');
    console.log('pgrok-ssh.service stopped successfully.');
  } catch (error) {
    console.error('Error stopping pgrok-ssh.service:', error);
  } finally {
    bus.disconnect();
  }
};
