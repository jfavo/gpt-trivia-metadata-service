import { IsNumber, IsString, Length } from 'class-validator';

export class UpdateSubcategory {
  @IsNumber()
  id: number;

  @IsString()
  @Length(2, 64)
  name: string;

  @IsNumber()
  categoryId: number;
}
