export const generateRID = (): string => {
  return `${Buffer.from(`${Date.now()}`)
    .toString('base64')
    .replace(/=/g, '')
    .substr(-3)}${Buffer.from(`${Math.random()}`)
    .toString('base64')
    .replace(/=/g, '')
    .substr(-3)}`;
};
