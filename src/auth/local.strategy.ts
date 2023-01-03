import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import {
  LoginCredentialsException, UserNotFoundOrEmailNotVerifiedException,
} from 'src/common/exceptions';
import { TokenHandler } from 'src/common/utils/token-handler';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.userService.getCredential('email', email);

    if (!user?.userId) {
      throw UserNotFoundOrEmailNotVerifiedException();
    }

    if (!(await TokenHandler.verifyKey(user!.password, password))) {
      throw LoginCredentialsException();
    }

    let payload = {
      email: user.email,
      sub: user.userId,
      phone: user.phone,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified
    };

    return { userId: user.userId, jwt: this.jwtService.sign(payload) };
  }
}
