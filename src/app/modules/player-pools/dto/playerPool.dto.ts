import { IsNumber } from 'class-validator';

export class PlayerPool {
  id: string;

  @IsNumber()
  userId: number;

  matchId?: number;
}
