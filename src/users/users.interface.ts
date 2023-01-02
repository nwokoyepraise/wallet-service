import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class User {
  user_id: string;
  email: string;
  email_verified: boolean;
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
}
