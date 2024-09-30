import { Injectable } from '@nestjs/common';
import { LoginSchema } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginSchema) {
    const user = await this.userService.validatePassword({ email }, password);
    const payload = { sub: user.id, username: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
    };
  }
}
