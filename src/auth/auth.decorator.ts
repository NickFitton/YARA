import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { PayloadSchema } from './dto/payload.dto';
import { Request } from 'express';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PayloadSchema => {
    const { user } = ctx
      .switchToHttp()
      .getRequest<Request & { user?: PayloadSchema }>();

    if (!user) {
      throw new InternalServerErrorException(
        'Attempt to get user on no-auth request',
      );
    }
    return user;
  },
);

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const { user } = ctx
      .switchToHttp()
      .getRequest<Request & { user?: PayloadSchema }>();

    if (!user) {
      throw new InternalServerErrorException(
        'Attempt to get user on no-auth request',
      );
    }
    return user.sub;
  },
);
