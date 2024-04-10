import { IsNumber, IsString, Length } from 'class-validator';

export class CreateSubcategory {
  @IsString()
  @Length(2, 64)
  name: string;

  @IsNumber()
  categoryId: number;
}
