import * as bcrypt from 'bcrypt';

export const compareInputPasswordWithBcrypt = async (
  inputPassword: string,
  databasePassword: string,
) => {
  return await bcrypt.compare(inputPassword, databasePassword);
};
