import bcrypt from 'bcrypt';

export const encryptPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(12);
  return bcrypt.hashSync(password, salt);
};

export const validPassword = (password: string, encodedPassword: string) => {
  return bcrypt.compareSync(password, encodedPassword);
};
