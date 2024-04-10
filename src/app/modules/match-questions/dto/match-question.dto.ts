import { IsNumber } from 'class-validator';

export class MatchQuestion {
  id: number;

  @IsNumber()
  subcategoryId: number;

  question: string;

  answer: number;

  choice1: string;

  choice2: string;

  choice3: string;

  choice4: string;
}
