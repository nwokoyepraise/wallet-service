import {ExtractJwt, Strategy} from "passport-jwt";
import {PassportStrategy} from "@nestjs/passport";
import {Injectable} from "@nestjs/common";
import {UsersService} from "../users/users.service";
import { User } from "src/users/users.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: {sub: string}): Promise<User|undefined|null> {
    return await this.userService.findUser("userId", payload.sub);
  }
}
