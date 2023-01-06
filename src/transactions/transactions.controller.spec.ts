import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import {
  UnableToCreatePaymentLinkException,
  WalletNotFoundException,
} from '../common/exceptions';
import { Iso4217 } from '../common/enums';
import { WalletsService } from '../wallets/wallets.service';
import { TransactionsController } from './transactions.controller';
import { FundWalletDto, TransferDto } from './transactions.dto';
import { TransactionStatus, TransactionType } from './transactions.enum';
import { TransactionsService } from './transactions.service';
import { InternalServerErrorException } from '@nestjs/common';
import { Wallet } from '../wallets/wallets.dto';

describe('TransactionsController', () => {
  let transactionsController: TransactionsController;
  let transactionsService: TransactionsService;
  let walletsService: WalletsService;
  let httpService: HttpService;
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

  let fakeWithdrawalTransaction = {
    transaction_id: `tr${ref}`,
    ref,
    source: 'USDJIJE99HJJO',
    amount: 3000,
    currency: Iso4217.NGN,
    status: TransactionStatus.PENDING,
    type: TransactionType.WITHDRAWAL,
  };


  let initiateFundingResponse = {
    data: { data: { link: 'https://example.com/any-link' }, status: 'success' },
    headers: {},
    config: { url: 'https://example.com/fake-url' },
    status: 200,
    statusText: 'OK',
  };

  let negativeInitiateFundingResponse = {
    data: { data: { link: 'https://example.com/any-link' }, status: 'failed' },
    headers: {},
    config: { url: 'https://example.com/fake-url' },
    status: 200,
    statusText: 'OK',
  };

  let fakeWallet: Wallet = {
    wallet_id: 'WA89JHHKDGE7',
    user_id: 'USDJIJE99HJJO',
    balance: 250000,
    currency: Iso4217.NGN,
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
        { provide: HttpService, useValue: { post: jest.fn() } },
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
    it('should fund not fund wallet because wallet doesn"t exist', async () => {
      jest
        .spyOn(transactionsService, 'initiateWalletFunding')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransaction);
        });

      jest.spyOn(walletsService, 'walletExists').mockImplementation(() => {
        return Promise.resolve(false);
      });

      jest
        .spyOn(httpService, 'post')
        .mockImplementation(() => of(initiateFundingResponse));

      expect(async () => {
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
        );
      }).rejects.toThrowError(WalletNotFoundException());
    });

    it('should fund not fund wallet because transaction couldn"t be added', async () => {
      jest
        .spyOn(transactionsService, 'initiateWalletFunding')
        .mockImplementation(() => {
          return Promise.resolve(null);
        });

      jest.spyOn(walletsService, 'walletExists').mockImplementation(() => {
        return Promise.resolve(true);
      });

      jest
        .spyOn(httpService, 'post')
        .mockImplementation(() => of(initiateFundingResponse));

      expect(async () => {
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
        );
      }).rejects.toThrowError(UnableToCreatePaymentLinkException());
    });

    it('should fund not fund wallet because link couldn"t be obtained from payment gateway', async () => {
      jest
        .spyOn(transactionsService, 'initiateWalletFunding')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransaction);
        });

      jest.spyOn(walletsService, 'walletExists').mockImplementation(() => {
        return Promise.resolve(true);
      });

      jest
        .spyOn(httpService, 'post')
        .mockImplementation(() => of(negativeInitiateFundingResponse));

      expect(async () => {
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
        );
      }).rejects.toThrowError(UnableToCreatePaymentLinkException());
    });

    it('should fund wallet', async () => {
      jest
        .spyOn(transactionsService, 'initiateWalletFunding')
        .mockImplementation(() => {
          return Promise.resolve(fakeTransaction);
        });

      jest.spyOn(walletsService, 'walletExists').mockImplementation(() => {
        return Promise.resolve(true);
      });

      jest
        .spyOn(httpService, 'post')
        .mockImplementation(() => of(initiateFundingResponse));

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
      ).toEqual({
        link: initiateFundingResponse.data.data.link,
        ...fakeTransaction,
      });
    });
  });

  describe('transfer-funds', () => {
    let transferDto: TransferDto = {
      amount: 3000,
      source_wallet: 'WA000000000001',
      beneficiary_wallet: 'WA0000000000002',
    };

    it('should be not be able to transfer funds because of transaction failure', async () => {
      jest
        .spyOn(transactionsService, 'transferFunds')
        .mockImplementation(() => {
          return Promise.resolve(false);
        });

      expect(async () => {
        await transactionsController.transferFunds(transferDto, {
          user_id,
          email: 'email@email.com',
          email_verified: 1,
        });
      }).rejects.toThrowError(InternalServerErrorException);
    });

    it('should be able to transfer funds', async () => {
      jest
        .spyOn(transactionsService, 'transferFunds')
        .mockImplementation(() => {
          return Promise.resolve(true);
        });

      expect(
        await transactionsController.transferFunds(transferDto, {
          user_id,
          email: 'email@email.com',
          email_verified: 1,
        }),
      ).toEqual({ message: 'success' });
    });
  });

  describe('withdraw-funds', () => {
    let transferDto: TransferDto = {
      amount: 3000,
      source_wallet: 'WA000000000001',
      beneficiary_wallet: 'WA0000000000002',
    };

    it('should be able to initiate withdrawals', async () => {
      jest
        .spyOn(transactionsController, 'resolveAccount')
        .mockImplementation(() => {
          return Promise.resolve({ status: 'success' });
        });

      jest.spyOn(walletsService, 'findWallet').mockImplementation(() => {
        return Promise.resolve(fakeWallet);
      });

      jest
        .spyOn(transactionsService, 'initiateWithdrawal')
        .mockImplementation(() => {
          return Promise.resolve(fakeWithdrawalTransaction);
        });

      expect(
        await transactionsService.initiateWithdrawal(
          fakeWallet.user_id,
          fakeWallet.currency,
          'ref',
          3000,
        ),
      ).toBe(fakeWithdrawalTransaction);
    });
  });
});
