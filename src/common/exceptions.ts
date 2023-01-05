import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export const EmailAlreadyUsedException = () =>
  new ConflictException('email already in use, please recover account');

export const VerifiedEmailAlreadyExistsException = () =>
  new ConflictException('verified email already exists');

export const EmailTokenNotFoundException = () =>
  new NotFoundException('token not found');

export const InvalidEmailTokenException = () =>
  new ForbiddenException('email token is invalid or has expired');

export const LoginCredentialsException = () =>
  new UnauthorizedException('login credentials are incorrect');

export const UserNotFoundOrEmailNotVerifiedException = () =>
  new NotFoundException('user not found or email not verified');

export const UnableToCreatePaymentLinkException = () =>
  new InternalServerErrorException('unable to create payment link');

export const TransactionNotFoundException = () =>
  new NotFoundException('transaction not found');

export const WalletNotFoundException = () =>
  new NotFoundException('wallet not found');

export const NotWalletOwnerException = () =>
  new ForbiddenException('user is not the ownerof wallet');

export const InvalidAccountException = () =>
  new ForbiddenException('account is not valid');

export const InsufficientBalanceException = () =>
new BadRequestException('insufficient balance');

export const CurrencyMismatchException = () =>
new BadRequestException('currency mismatch between source and beneficiary wallets');
