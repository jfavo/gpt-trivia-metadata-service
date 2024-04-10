import { IsDateString, IsObject, IsUUID } from 'class-validator';

export class UpdateMatch {
  @IsUUID()
  id: string;

  @IsDateString()
  startedAt?: Date;

  @IsDateString()
  finishedAt?: Date;

  @IsObject()
  matchData: any = {};
}
