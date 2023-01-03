import { ConflictException } from "@nestjs/common";

export const EmailAlreadyUsedException = () =>
new ConflictException('email already in use, please recover account');

export const VerifiedEmailAlreadyExistsException = () =>
new ConflictException('verified email already exists');