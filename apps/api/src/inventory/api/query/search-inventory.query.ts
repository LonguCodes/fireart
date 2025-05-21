import { IsOptional, IsString, Length } from 'class-validator';

export class SearchInventoryQuery {
  @IsString()
  @IsOptional()
  @Length(3)
  name: string;
}
