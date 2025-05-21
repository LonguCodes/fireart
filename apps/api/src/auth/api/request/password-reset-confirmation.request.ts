import { IsString } from 'class-validator';

export class PasswordResetConfirmationRequest {
  @IsString()
  token: string;

  @IsString()
  password: string;
}
