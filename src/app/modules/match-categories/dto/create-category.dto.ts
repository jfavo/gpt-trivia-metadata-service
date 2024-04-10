import { IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { CreateSubcategory } from './create-subcategory.dto';

export class CreateCategory {
  @IsString()
  @Length(2, 24)
  name: string;

  @IsOptional()
  @IsNumber()
  userId?: number;

  subcategories?: CreateSubcategory[];
}
