import { IsNumber, IsString } from 'class-validator';

export class CreateQuestion {
  id: number;

  @IsNumber()
  subcategoryId: number;

  @IsString()
  question: string;

  @IsNumber()
  answer: number;

  @IsString()
  choice1: string;

  @IsString()
  choice2: string;

  @IsString()
  choice3: string;

  @IsString()
  choice4: string;
}
