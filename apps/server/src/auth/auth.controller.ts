import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { loginSchema, LoginDto, TokenDto } from '@yara/api/auth';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/pipes/zod.pipe';
import { User } from './auth.decorator';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() body: LoginDto): Promise<TokenDto> {
    const jwt = await this.authService.login(body);
    return { accessToken: jwt };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@User() user: TokenDto) {
    console.log(user);
  }
}
