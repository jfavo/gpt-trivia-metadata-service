import { IsNumber } from 'class-validator';

export class Friend {
  @IsNumber()
  userId1: number;

  @IsNumber()
  userId2: number;
}
