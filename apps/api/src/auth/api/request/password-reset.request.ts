import { IsEmail, IsString } from 'class-validator';

export class PasswordResetRequest {
  @IsString()
  @IsEmail()
  email: string;
}
