import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { VerifiedEmailAlreadyExistsException } from '../common/exceptions';
import { UsersController } from './users.controller';
import { AddUserDto, User } from './users.dto';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let date = new Date();

  let fakeUser: User = {
    user_id: 'USDJIJE99HJJO',
    email: 'email@email.com',
    password: 'hashed-password',
    email_verified: 0,
    created_at: date,
    updated_at: date,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            addUser: jest.fn(),
            findUser: jest.fn(),
            getCredential: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('add-user', () => {
    it('should not add user because verified email exists', async () => {
      const addUserDto: AddUserDto = {
        user_id: 'USDJIJE99HJJO',
        email: 'email@email.com',
        password: 'hashed-password',
      };

      jest.spyOn(usersService, 'addUser').mockImplementation((addUserDto) => {
        return Promise.resolve(fakeUser);
      });

      jest.spyOn(usersService, 'findUser').mockImplementation(() => {
        return Promise.resolve({
          user_id: 'USDJIJE99HJJO',
          email: 'email@email.com',
          password: 'hashed-password',
          email_verified: 1,
          created_at: date,
          updated_at: date,
        });
      });

      expect(await usersController.addUser(addUserDto)).toThrow(
        ConflictException,
      );
    });

    it('should add a user', async () => {
      const addUserDto: AddUserDto = {
        user_id: 'USDJIJE99HJJO',
        email: 'email@email.com',
        password: 'hashed-password',
      };

      jest.spyOn(usersService, 'addUser').mockImplementation((addUserDto) => {
        return Promise.resolve(fakeUser);
      });
      expect(await usersController.addUser(addUserDto)).toEqual(fakeUser);
    });
  });
});
