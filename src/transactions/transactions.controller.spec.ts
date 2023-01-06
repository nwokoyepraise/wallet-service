import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable, of } from 'rxjs';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { Iso4217 } from '../common/enums';
import { WalletsService } from '../wallets/wallets.service';
import { TransactionsController } from './transactions.controller';
import { FundWalletDto } from './transactions.dto';
import { TransactionStatus, TransactionType } from './transactions.enum';
import { TransactionsService } from './transactions.service';

describe('TransactionsController', () => {
  let transactionsController: TransactionsController;
  let transactionsService: TransactionsService;
  let walletsService: WalletsService;
  let httpService: HttpService
  let ref = 'hd90dHJiieo9buW3';
  let wallet_id = 'WA89JHHKDGE7';
  let user_id = 'USDJIJE99HJJO';
  let fakeTransaction = {
    transaction_id: `tr${ref}`,
    ref,
    source: 'USDJIJE99HJJO',
    amount: 1000,
    currency: Iso4217.NGN,
    status: TransactionStatus.PENDING,
    type: TransactionType.FUNDING,
  };

  let initiateFundingResponse= {
    data: {data:{link: 'https://example.com/any-link'}, status: 'success'},
    headers: {},
    config: { url: 'https://example.com/fake-url' },
    status: 200,
    statusText: 'OK',
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: {
            initiateWalletFunding: jest.fn(),
            completeWalletFunding: jest.fn(),
            findTransaction: jest.fn(),
            transferFunds: jest.fn(),
            initiateWithdrawal: jest.fn(),
            completeWithdrawal: jest.fn(),
          },
        },
        {
          provide: WalletsService,
          useValue: { walletExists: jest.fn(), findWallet: jest.fn() },
        },
        { provide: HttpService, useValue: {post: jest.fn()} },
      ],
    }).compile();

    transactionsController = module.get<TransactionsController>(
      TransactionsController,
    );
    transactionsService = module.get<TransactionsService>(TransactionsService);
    walletsService = module.get<WalletsService>(WalletsService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(transactionsController).toBeDefined();
  });

  describe('fund-wallet', () => {
    it('should fund wallet', async () => {
      jest
        .spyOn(transactionsService, 'initiateWalletFunding')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransaction);
        });

      jest.spyOn(walletsService, 'walletExists').mockImplementation(() => {
        return Promise.resolve(true);
      });

      jest.spyOn(httpService, 'post').mockImplementation(()=> of(initiateFundingResponse))

      expect(
        await transactionsController.fundWallet(
          {
            currency: fakeTransaction.currency,
            amount: fakeTransaction.amount,
            wallet_id,
          },
          {
            user_id,
            email: 'email@email.com',
            email_verified: 1,
          },
        ),
      ).toEqual({link:initiateFundingResponse.data.data.link, ...fakeTransaction});
    });
  });
});
