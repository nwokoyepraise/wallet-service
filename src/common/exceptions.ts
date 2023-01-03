import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';

export const EmailAlreadyUsedException = () =>
  new ConflictException('email already in use, please recover account');

export const VerifiedEmailAlreadyExistsException = () =>
  new ConflictException('verified email already exists');

export const EmailTokenNotFoundException = () =>
  new NotFoundException('token not found');

export const InvalidEmailTokenException = () =>
  new ForbiddenException('email token is invalid or has expired');
