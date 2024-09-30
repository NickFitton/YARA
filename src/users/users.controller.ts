import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserSchema } from './dto/create-user.dto';
import { UpdateUserSchema } from './dto/update-user.dto';
import { UpdatePasswordSchema } from './dto/update-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() body: CreateUserSchema) {
    return this.usersService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateUserSchema) {
    return this.usersService.update(id, body);
  }

  @Post(':id/password')
  updatePassword(@Param('id') id: string, @Body() body: UpdatePasswordSchema) {
    return this.usersService.updatePassword(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
