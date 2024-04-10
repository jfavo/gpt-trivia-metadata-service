import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class UpdateCategory {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsString()
  @Length(2, 24)
  name: string;
}
