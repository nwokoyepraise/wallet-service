import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { VerifyEmailDto } from './auth.dto';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let usersService: UsersService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: { verifyEmailToken: jest.fn(), getEmailToken: jest.fn() },
        },
        { provide: UsersService, useValue: { findUser: jest.fn() } },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('verify-email', () => {
    let date = new Date();
    // let verifyEmailDto: VerifyEmailDto = {
    //   email: 'email@email.com',
    //   token: '123456',
    //   user_id: 'USDJIJE99HJJO',
    // };
    it('should be able to verify email', async () => {
      jest.spyOn(usersService, 'findUser').mockImplementation(() => {
        return Promise.resolve({
          user_id: 'USDJIJE99HJJO',
          email: 'email@email.com',
          password: 'hashed-password',
          email_verified: 0,
          created_at: date,
          updated_at: date,
        });
      });

      jest.spyOn(authService, 'getEmailToken').mockImplementation(() => {
        return Promise.resolve({
          user_id: 'USDJIJE99HJJO',
          email: 'email@email.com',
          token:
            '$argon2i$v=19$m=16,t=2,p=1$bm9oaXBpaHBpaGloaQ$Z3QvaYD3qXQIob9eLTl5Ig',
          created_at: date,
          updated_at: date,
        });
      });

      jest.spyOn(authService, 'verifyEmailToken').mockImplementation(() => {
        return Promise.resolve(true);
      });
      process.env.TEST_TOKEN = '123456';
      expect(
        await authController.verifyEmail({
          email: 'email@email.com',
          token: '123456',
          user_id: 'USDJIJE99HJJO',
        }),
      ).toEqual({
        message: 'success',
      });
    });
  });
});
