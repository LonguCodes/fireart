import { ApiProperty } from '@nestjs/swagger';

export class IdResponse {
  constructor(id: string) {
    this.id = id;
  }

  @ApiProperty()
  id: string;
}
