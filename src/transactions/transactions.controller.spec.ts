import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { WalletsService } from '../wallets/wallets.service';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

describe('TransactionsController', () => {
  let transactionsController: TransactionsController;
  let transactionsService: TransactionsService;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController ],
      providers: [{provide: TransactionsService, useValue: jest.fn()}, {provide: WalletsService, useValue: jest.fn()}, {provide: HttpService, useValue: jest.fn()}]
    }).compile();

    transactionsController = module.get<TransactionsController>(
      TransactionsController,
    );
    transactionsService = module.get<TransactionsService>(TransactionsService);
   
  });

  it('should be defined', () => {
    expect(transactionsController).toBeDefined();
  });
});
