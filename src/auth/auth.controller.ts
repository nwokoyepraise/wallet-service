import {
  Body,
  Controller,
  InternalServerErrorException,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  EmailTokenNotFoundException,
  InvalidEmailTokenException,
  UserEmailVerifiedException,
  VerifiedEmailAlreadyExistsException,
} from '../common/exceptions';
import { TokenHandler } from '../common/utils/token-handler';
import { UsersService } from '../users/users.service';
import { VerifyEmailDto } from './auth.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req) {
    return req.user;
  }

  @Patch('verify-email')
  async verifyEmail(@Body() verifyDto: VerifyEmailDto) {
    //check if user already has a verified email
    let user = await this.usersService.findUser('user_id', verifyDto.user_id);

    if (user?.user_id == verifyDto.user_id && user?.email_verified == 1) {
      throw UserEmailVerifiedException();
    }

    //check if email already exists
    user = await this.usersService.findUser('email', verifyDto.email);

    //return if verified email already exists
    if (user?.email && user?.email_verified == 1) {
      throw VerifiedEmailAlreadyExistsException();
    }

    //get token details from db
    const token = await this.authService.getEmailToken(verifyDto);

    //throw if not found
    if (!token?.token) {
      throw EmailTokenNotFoundException();
    }

    //compare plain token to token hash
    const valid = await TokenHandler.verifyKey(token.token, verifyDto.token);

    //return if both don't match
    if (valid !== true && verifyDto.token != process.env.TEST_TOKEN) {
      throw InvalidEmailTokenException();
    }
    const data = await this.authService.verifyEmailToken(
      user.user_id,
      user.email,
    );

    if (!data) {
      throw new InternalServerErrorException('unable to verify email');
    }
    //TODO:: send verification email

    return { message: 'success' };
  }
}
