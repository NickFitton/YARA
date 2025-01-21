import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import {
  createToDbEntity,
  readFromDbEntity,
  updateToDbEntity,
} from './users.transformer';
import { verify } from 'argon2';
import { User } from '@prisma/client';
import { CreateUserDto, ReadUserDto, UpdatePasswordDto } from '@yara/api/user';
import { UserInternalDto } from './users.internal.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(user: CreateUserDto): Promise<ReadUserDto> {
    return createToDbEntity(user)
      .then((hashedData) => this.prisma.user.create({ data: hashedData }))
      .then(readFromDbEntity);
  }

  update(id: string, user: Partial<UserInternalDto>): Promise<void> {
    return this.prisma.user
      .update({ where: { id }, data: updateToDbEntity(user) })
      .then();
  }

  remove(id: string): Promise<void> {
    return this.prisma.user.delete({ where: { id } }).then();
  }

  validatePassword(
    user: Partial<ReadUserDto>,
    password: string,
  ): Promise<User> {
    return this.prisma.user
      .findFirst({ where: user })
      .then((user) => {
        if (!user) {
          console.log('Password validation - bad email');
          throw new UnauthorizedException();
        }
        return Promise.all([user, verify(user.password, password)]);
      })
      .then(([user, passwordGood]) => {
        if (!passwordGood) {
          console.log('Password validation - bad password');
          throw new UnauthorizedException();
        }
        return user;
      });
  }

  updatePassword(id: string, body: UpdatePasswordDto): Promise<void> {
    return this.validatePassword({ id }, body.oldPassword).then(() =>
      this.update(id, { password: body.newPassword }),
    );
  }
}
