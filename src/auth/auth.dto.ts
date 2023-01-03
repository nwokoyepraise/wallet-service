import { IsEmail, MaxLength, IsNotEmpty, IsString } from 'class-validator';

export class verifyEmailDto {
  @IsEmail()
  @MaxLength(255)
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly user_id: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(6)
  readonly token: string;
}

export type GetEmailTokenParams = Readonly<{
  email: string;
  user_id: string;
}>;
