import { Test, TestingModule } from '@nestjs/testing';
import knex, { Knex } from 'knex';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, {provide: 'default_KnexModuleConnectionToken', useValue: jest.fn()}],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });
});
