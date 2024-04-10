import { Injectable } from '@nestjs/common';
import { ErrorMessage } from '../../../common/errors/error.message';
import { IsPostgresForeignKeyViolation } from '../../../common/errors/error.utils';
import {
  PLAYER_POOLS_CREATE_DB_ERROR,
  PLAYER_POOLS_CREATE_VALIDATION_ERROR,
} from './player-pools.errors';
import { PlayerPool } from './dto/playerPool.dto';
import { BulkPlayerPool } from './dto/bulkPlayerPool.dto';

@Injectable()
export class PlayerPoolsService {
  getCreatePlayerPoolError(err): ErrorMessage {
    if (IsPostgresForeignKeyViolation(err)) {
      // If we have a foreign key violation then the
      // ID should be the only numerical value associated
      // with the error detail so we grab it to append
      // to the error message.
      const id = err.detail.match(/\d+/)[0];
      return PLAYER_POOLS_CREATE_VALIDATION_ERROR(
        `User for id ${id} does not exist in records`,
      );
    }

    return PLAYER_POOLS_CREATE_DB_ERROR;
  }

  /**
   * Maps an array of PlayerPools objects to an array of BulkPlayerPool objects
   * to aggregate user ids under one pool id
   * @param pools Array of Player Pool objects to map to Bulk
   * @returns Array of Bulk Player Pool objects
   */
  mapPlayerPoolsToBulk(pools: PlayerPool[]): BulkPlayerPool[] {
    const returnData = pools.reduce((acc: object, curr: PlayerPool): any => {
      if (Object.keys(acc).includes(curr.id)) {
        acc[curr.id].userIds.push(curr.userId);
      } else {
        acc[curr.id] = new BulkPlayerPool(curr.id, curr.matchId, curr.userId);
      }
      return acc;
    }, {});

    return Object.values(returnData);
  }
}
