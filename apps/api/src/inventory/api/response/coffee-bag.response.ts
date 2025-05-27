import { ApiProperty } from '@nestjs/swagger';

export class CoffeeBagResponse {
  constructor(id: string, name: string, roastedOn: Date) {
    this.id = id;
    this.name = name;
    this.roastedOn = roastedOn.toISOString();
  }

  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  roastedOn: string;
}
