import { ApiProperty } from '@nestjs/swagger';

export class TokenResponse {
  constructor(token: string) {
    this.token = token;
  }

  @ApiProperty()
  token: string;
}
