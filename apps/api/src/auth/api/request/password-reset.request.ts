import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordResetRequest {
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;
}
