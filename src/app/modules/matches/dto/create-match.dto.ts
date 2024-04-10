import { IsObject } from 'class-validator';

export class CreateMatch {
  id: string;

  startedAt?: Date;

  finishedAt?: Date;

  @IsObject()
  matchData: any = {};
}
