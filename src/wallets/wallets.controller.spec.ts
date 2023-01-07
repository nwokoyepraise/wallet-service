import { Test, TestingModule } from '@nestjs/testing';
import {
  NotWalletOwnerException,
  WalletNotFoundException,
} from '../common/exceptions';
import { Iso4217 } from '../common/enums';
import { WalletsController } from './wallets.controller';
import { AddWalletDto, Wallet } from './wallets.dto';
import { WalletsService } from './wallets.service';

describe('WalletsController', () => {
  let walletsController: WalletsController;
  let walletsService: WalletsService;
  let date = new Date();

  let fakeWallet: Wallet = {
    wallet_id: 'WA89JHHKDGE7',
    user_id: 'USDJIJE99HJJO',
    balance: 0,
    currency: Iso4217.NGN,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletsController],
      providers: [
        {
          provide: WalletsService,
          useValue: {
            findWallet: jest.fn(),
          },
        },
      ],
    }).compile();

    walletsController = module.get<WalletsController>(WalletsController);
    walletsService = module.get<WalletsService>(WalletsService);
  });

  it('should be defined', () => {
    expect(walletsController).toBeDefined();
  });

  describe('find-wallet', () => {
    it('should find a wallet', async () => {
      jest.spyOn(walletsService, 'findWallet').mockImplementation(() => {
        return Promise.resolve(fakeWallet);
      });
      expect(
        await walletsController.findWallet({
          user_id: fakeWallet.user_id,
          email: 'email@email.com',
          email_verified: 1,
        }),
      ).toEqual(fakeWallet);
    });

    it('should not find a wallet bacause wallet_id doesn"t exist', async () => {
      jest.spyOn(walletsService, 'findWallet').mockImplementation(() => {
        return Promise.resolve(null);
      });
      expect(async () => {
        await walletsController.findWallet({
          user_id: fakeWallet.user_id,
          email: 'email@email.com',
          email_verified: 1,
        });
      }).rejects.toThrowError(WalletNotFoundException());
    });
  });

  // describe('find-wallets', () => {
  //   it('should find array wallet', async () => {
  //     jest.spyOn(walletsService, 'findWallets').mockImplementation(() => {
  //       return Promise.resolve([fakeWallet]);
  //     });
  //     expect(
  //       await walletsController.findWallets({
  //         user_id: fakeWallet.user_id,
  //         email: 'email@email.com',
  //         email_verified: 1,
  //       }),
  //     ).toEqual([fakeWallet]);
  //   });
  // });

  // it('should add a wallet', async () => {
  //   const addWalletDto: AddWalletDto = {
  //     currency: Iso4217.NGN,
  //   };

  //   jest
  //     .spyOn(walletsService, 'addWallet')
  //     .mockImplementation((addWalletDto) => {
  //       return Promise.resolve(fakeWallet);
  //     });
  //   expect(
  //     await walletsController.addWallet(addWalletDto, {
  //       user_id: fakeWallet.user_id,
  //       email: 'email@email.com',
  //       email_verified: 1,
  //     }),
  //   ).toEqual(fakeWallet);
  // });
});
