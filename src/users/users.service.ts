import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserSchema } from './dto/create-user.dto';
import { InternalUpdateUserSchema } from './dto/update-user.dto';
import { PrismaService } from 'src/services/prisma.service';
import { UpdatePasswordSchema } from './dto/update-password.dto';
import {
  createToDbEntity,
  readFromDbEntity,
  updateToDbEntity,
} from './users.transformer';
import { ReadUserDto } from './dto/read-user.dto';
import { verify } from 'argon2';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(user: CreateUserSchema): Promise<ReadUserDto> {
    return createToDbEntity(user)
      .then((hashedData) => this.prisma.user.create({ data: hashedData }))
      .then(readFromDbEntity);
  }

  update(id: string, user: InternalUpdateUserSchema): Promise<void> {
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

  updatePassword(id: string, body: UpdatePasswordSchema): Promise<void> {
    return this.validatePassword({ id }, body.oldPassword).then(() =>
      this.update(id, { password: body.newPassword }),
    );
  }
}
