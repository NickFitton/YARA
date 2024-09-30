import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginSchema, LoginSchema } from './dto/login.dto';
import { ZodValidationPipe } from 'src/pipes/zod.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  login(@Body() body: LoginSchema) {
    return this.authService.login(body);
  }
}
