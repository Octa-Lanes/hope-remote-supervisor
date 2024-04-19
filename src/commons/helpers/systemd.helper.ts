import { systemBus } from 'dbus-next';

// export const serviceStatus = async (type: string): Promise<boolean> => {
//   const bus = systemBus();
//   const serviceNameDBUS = 'org.freedesktop.systemd1';
//   const objectPath = `/org/freedesktop/systemd1/unit/pgrok_2d${type}_2eservice`;
//   const interfaceName = 'org.freedesktop.DBus.Properties';

//   try {
//     const object = await bus.getProxyObject(serviceNameDBUS, objectPath);
//     const properties = object.getInterface(interfaceName);
//     const activeState = await properties.Get(
//       'org.freedesktop.systemd1.Unit',
//       'ActiveState',
//     );

//     const status: 'active' | 'inactive' = activeState.value;
//     return status === 'active';
//   } catch (error) {
//     console.error('Error:', error);
//   } finally {
//     bus.disconnect();
//   }
// };

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
