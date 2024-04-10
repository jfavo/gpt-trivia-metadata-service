import { IsArray } from 'class-validator';

export class CreatePool {
  @IsArray({
    message: 'userIds should be an array',
  })
  userIds: number[];
}
