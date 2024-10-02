import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Response } from 'express';
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
  async login(
    @Body() body: LoginSchema,
    @Res({ passthrough: true }) response: Response,
  ) {
    const jwt = await this.authService.login(body);
    response.cookie('accessToken', jwt);
    return { accessToken: jwt };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@User() user: PayloadSchema) {
    console.log(user);
  }
}
