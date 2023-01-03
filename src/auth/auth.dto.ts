import { IsEmail, MaxLength, IsNotEmpty, IsString, IsNumberString } from 'class-validator';

export class verifyEmailDto {
  @IsEmail()
  @MaxLength(255)
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly user_id: string;

  @IsNotEmpty()
  @IsNumberString()
  @MaxLength(6)
  readonly token: string;
}

export type GetEmailTokenParams = Readonly<{
  email: string;
  user_id: string;
}>;
