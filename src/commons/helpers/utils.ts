export const getDeviceId = (): string => {
  return Math.floor(Math.random() * 1000000).toString();
};
