import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCoffeeBagRequest {
  @IsString()
  @ApiProperty()
  name: string;
}
