import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from './auth.constants';
import { payloadSchema } from './dto/payload.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.findAuthHeader(request) || this.findAuthCookie(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      const userPayload = payloadSchema.parse(payload);
      request['user'] = userPayload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private findAuthHeader(request: Request): string | undefined {
    const authHeader = request.headers?.authorization;
    if (!authHeader) {
      return undefined;
    }
    const headerParts = authHeader.split(' ');
    if (headerParts.length !== 2 || headerParts[0] !== 'Bearer') {
      return undefined;
    }
    return headerParts[1];
  }

  private findAuthCookie(request: Request): string | undefined {
    return request.cookies?.accessToken;
  }
}
