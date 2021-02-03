/* istanbul ignore file */
const portPattern = /^[1-9]\d+$/;
export const port =
  process.env.PORT && portPattern.test(process.env.PORT)
    ? Number(process.env.PORT)
    : 1337;
