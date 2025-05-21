import { IsString } from 'class-validator';

export class UpdateCoffeeBagRequest {
  @IsString()
  name: string;
}
