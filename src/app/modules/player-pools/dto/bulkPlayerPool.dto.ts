export class BulkPlayerPool {
  id: string;
  userIds: number[];
  matchId?: number;

  constructor(id: string, matchId?: number, ...userIds: number[]) {
    this.id = id;
    this.userIds = userIds;
    this.matchId = matchId;
  }
}
