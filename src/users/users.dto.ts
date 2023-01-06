import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class User {
  user_id: string;
  email: string;
  email_verified: 0 | 1;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export class AddUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  user_id: string;
}

export type UserPayload = Readonly<{
  email: string;
  user_id: string;
  email_verified: 0 | 1;
}>;
