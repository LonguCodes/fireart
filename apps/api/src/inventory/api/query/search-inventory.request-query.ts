import { IsOptional, IsString, Length } from 'class-validator';

export class SearchInventoryRequestQuery {
  @IsString()
  @IsOptional()
  @Length(3)
  name: string;
}
