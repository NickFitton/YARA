import { hash } from 'argon2';
import { Prisma, User } from '@prisma/client';
import { CreateUserDto, ReadUserDto } from '@yara/api/user';
import { UserInternalDto } from './users.internal.dto';

export const createToDbEntity = async ({
  firstName,
  lastName,
  email,
  password,
}: CreateUserDto): Promise<Prisma.UserCreateInput> => ({
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
}: Partial<UserInternalDto>): Promise<Prisma.UserUpdateInput> => {
  const entity: Prisma.UserUpdateInput = { ...user };
  if (password) {
    entity.password = await hash(password);
  }
  return entity;
};
