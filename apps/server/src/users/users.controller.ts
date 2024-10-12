import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserSchema, CreateUserSchema } from './dto/create-user.dto';
import { updateUserSchema, UpdateUserSchema } from './dto/update-user.dto';
import {
  updatePasswordSchema,
  UpdatePasswordSchema,
} from './dto/update-password.dto';
import { ZodValidationPipe } from 'src/pipes/zod.pipe';
import { z } from 'zod';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  create(@Body() body: CreateUserSchema) {
    return this.usersService.create(body);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(updateUserSchema, { id: z.string().uuid() }))
  update(@Param('id') id: string, @Body() body: UpdateUserSchema) {
    return this.usersService.update(id, body);
  }

  @Post(':id/password')
  @UsePipes(
    new ZodValidationPipe(updatePasswordSchema, { id: z.string().uuid() }),
  )
  updatePassword(@Param('id') id: string, @Body() body: UpdatePasswordSchema) {
    return this.usersService.updatePassword(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
