import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginSchema, LoginSchema } from './dto/login.dto';
import { ZodValidationPipe } from 'src/pipes/zod.pipe';
import { PayloadSchema } from './dto/payload.dto';
import { User } from './auth.decorator';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() body: LoginSchema) {
    const jwt = await this.authService.login(body);
    return { accessToken: jwt };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@User() user: PayloadSchema) {
    console.log(user);
  }
}
