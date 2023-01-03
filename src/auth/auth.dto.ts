import { IsEmail, MaxLength, IsNotEmpty, IsString } from 'class-validator';
import { EmailVerifUsage } from './auth.enum';

export class verifyEmailDto {
  @IsEmail()
  @MaxLength(255)
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly userId: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(6)
  readonly token: string;
}

export type GetEmailTokenParams = Readonly<{
    email: string;
    userId: string;
    usage: EmailVerifUsage;
  }>;