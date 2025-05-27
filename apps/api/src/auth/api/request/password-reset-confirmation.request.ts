import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordResetConfirmationRequest {
  @IsString()
  @ApiProperty()
  token: string;

  @IsString()
  @ApiProperty()
  password: string;
}
