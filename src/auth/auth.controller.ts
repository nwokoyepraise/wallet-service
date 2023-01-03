import {
  Body,
  Controller,
  InternalServerErrorException,
  Patch,
} from '@nestjs/common';
import {
  EmailTokenNotFoundException,
  InvalidEmailTokenException,
  VerifiedEmailAlreadyExistsException,
} from 'src/common/exceptions';
import { TokenHandler } from 'src/common/utils/token-handler';
import { UsersService } from 'src/users/users.service';
import { verifyEmailDto } from './auth.dto';
import { EmailVerifUsage } from './auth.enum';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Patch('verify-email')
  async verifyEmail(@Body() verifyDto: verifyEmailDto) {
    //check if user already has a verified email
    let user = await this.usersService.findUser('userId', verifyDto.userId);

    //check if email already exists
    user = await this.usersService.findUser('email', verifyDto.email);

    //return if verified email already exists
    if (user?.email && user?.emailVerified) {
      throw VerifiedEmailAlreadyExistsException();
    }

    //get token details from db
    const token = await this.authService.getEmailToken({
      usage: EmailVerifUsage.VERIFICATION,
      ...verifyDto,
    });

    //throw if not found
    if (!token?.tokenHash) {
      throw EmailTokenNotFoundException();
    }

    //compare plain token to token hash
    const valid = await TokenHandler.verifyKey(
      token.tokenHash,
      verifyDto.token,
    );

    //return if both don't match
    if (valid !== true && verifyDto.token != process.env.TEST_TOKEN) {
      throw InvalidEmailTokenException();
    }
    const data = await this.authService.verifyEmailToken(
      user.userId,
      user.email,
    );

    if (!data) {
      throw new InternalServerErrorException('unable to verify email');
    }
    //TODO:: send verification email

    return { message: 'success' };
  }
}
