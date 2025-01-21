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
import {
  createUserSchema,
  updateUserSchema,
  updatePasswordSchema,
  CreateUserDto,
  UpdateUserDto,
  UpdatePasswordDto,
} from '@yara/api/user';
import { ZodValidationPipe } from 'src/pipes/zod.pipe';
import { z } from 'zod';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(updateUserSchema, { id: z.string().uuid() }))
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }

  @Post(':id/password')
  @UsePipes(
    new ZodValidationPipe(updatePasswordSchema, { id: z.string().uuid() }),
  )
  updatePassword(@Param('id') id: string, @Body() body: UpdatePasswordDto) {
    return this.usersService.updatePassword(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
