import { IsDateString, IsString } from 'class-validator';

export class CreateCoffeeBagRequest {
  @IsString()
  name: string;
  @IsDateString()
  roastedOn: string;
}
