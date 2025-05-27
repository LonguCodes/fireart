import { IsDateString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCoffeeBagRequest {
  @IsString()
  @ApiProperty()
  name: string;
  @IsDateString()
  @ApiProperty()
  roastedOn: string;
}
