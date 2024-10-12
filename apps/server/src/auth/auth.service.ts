import { Injectable } from '@nestjs/common';
import { LoginSchema } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PayloadSchema } from './dto/payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginSchema) {
    const user = await this.userService.validatePassword({ email }, password);
    const payload: PayloadSchema = { sub: user.id, username: user.email };
    return this.jwtService.signAsync(payload);
  }
}
