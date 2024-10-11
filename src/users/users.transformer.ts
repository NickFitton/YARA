import { hash } from 'argon2';
import { CreateUserSchema } from './dto/create-user.dto';
import { Prisma, User } from '@prisma/client';
import { ReadUserDto } from './dto/read-user.dto';
import { InternalUpdateUserSchema } from './dto/update-user.dto';

export const createToDbEntity = async ({
  firstName,
  lastName,
  email,
  password,
}: CreateUserSchema): Promise<Prisma.UserCreateInput> => ({
  firstName,
  lastName,
  email,
  password: await hash(password),
});

export const readFromDbEntity = ({
  // We're actively avoiding returning password hash from the db
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  password: _password,
  ...user
}: User): ReadUserDto => user;

export const updateToDbEntity = async ({
  password,
  ...user
}: InternalUpdateUserSchema): Promise<Prisma.UserUpdateInput> => {
  const entity: Prisma.UserUpdateInput = { ...user };
  if (password) {
    entity.password = await hash(password);
  }
  return entity;
};
