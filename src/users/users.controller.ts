import { Body, Controller, Post } from '@nestjs/common';
import { AddUserDto } from './users.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async addUser(@Body() addUserDto: AddUserDto) {
    return await this.usersService.addUser(addUserDto);
  }
}
