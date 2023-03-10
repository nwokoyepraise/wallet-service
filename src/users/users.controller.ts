import { Body, Controller, Post } from '@nestjs/common';
import {
  EmailAlreadyUsedException,
  VerifiedEmailAlreadyExistsException,
} from '../common/exceptions';
import { KeyGen } from '../common/utils/key-gen';
import { TokenHandler } from '../common/utils/token-handler';
import { AddUserDto } from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async addUser(@Body() addUserDto: AddUserDto) {
    let data = await this.usersService.findUser('email', addUserDto.email);
    //return if verified email already exists
    if (data?.email && data?.email_verified == 1) {
      throw VerifiedEmailAlreadyExistsException();
    }

    //throw if email exists but not verified
    if (data?.email && data.email_verified != 1) {
      throw EmailAlreadyUsedException();
    }
    addUserDto.password = await TokenHandler.hashKey(addUserDto.password);
    addUserDto.user_id =   `US${KeyGen.gen(13)}`;
    return await this.usersService.addUser(addUserDto);
  }
}
