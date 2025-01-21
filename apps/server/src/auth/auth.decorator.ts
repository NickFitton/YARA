import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { TokenPayloadDto } from '@yara/api/auth';
import { Request } from 'express';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): TokenPayloadDto => {
    const { user } = ctx
      .switchToHttp()
      .getRequest<Request & { user?: TokenPayloadDto }>();

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
      .getRequest<Request & { user?: TokenPayloadDto }>();

    if (!user) {
      throw new InternalServerErrorException(
        'Attempt to get user on no-auth request',
      );
    }
    return user.sub;
  },
);
