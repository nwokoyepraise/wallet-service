import { Body, Controller, Post } from '@nestjs/common';
import { TokenHandler } from 'src/common/utils/token-handler';
import { AddUserDto } from './users.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async addUser(@Body() addUserDto: AddUserDto) {
    addUserDto.password = await TokenHandler.hashKey(addUserDto.password)
    return await this.usersService.addUser(addUserDto);
  }
}
