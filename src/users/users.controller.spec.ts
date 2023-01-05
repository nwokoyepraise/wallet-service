import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AddUserDto, User } from './users.dto';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

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
    it('should add a user', () => {
      let date = new Date();
      const user: AddUserDto = {
        user_id: 'USDJIJE99HJJO',
        email: 'email@email.com',
        password: 'hashed-password',
      };

      jest.spyOn(usersService, 'addUser').mockImplementation(() => {
        return Promise.resolve(user);
      });

      expect(usersController.addUser(user)).resolves.toEqual({
        ...user,
        user_id: 'USDJIJE99HJJO',
        email_verified: 0,
        created_at: date,
        updated_at: date,
      })
    });
  });
});
