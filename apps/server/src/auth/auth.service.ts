import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, TokenPayloadDto } from '@yara/api/auth';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginDto) {
    const user = await this.userService.validatePassword({ email }, password);
    const payload: TokenPayloadDto = { sub: user.id, username: user.email };
    return this.jwtService.signAsync(payload);
  }
}
