import { IsEmail, IsString } from 'class-validator';

export class CredentialsRequest {
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
