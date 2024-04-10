import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { PlayerPool } from './dto/playerPool.dto';
import postgres from 'postgres';
import { randomUUID } from 'crypto';

@Injectable()
export class PlayerPoolsRepo {
  constructor(private readonly database: DatabaseService) {}

  async getAll(getUsers?: boolean): Promise<PlayerPool[]> {
    try {
      const playerPools = await this.database.PostgresClient<PlayerPool[]>`
            SELECT * FROM player_pools
        `;

      if (getUsers) {
        // TODO: Grab all user data for the user ids returned from the pool
        // if this flag is passed. A SQL Join should suffice
      }

      return Promise.resolve(playerPools);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getPoolById(
    id: number,
    getUsers?: boolean,
  ): Promise<object | undefined> {
    try {
      const playerPools = await this.database.PostgresClient<PlayerPool[]>`
            SELECT * FROM player_pools WHERE id = ${id}
        `;

      let pool;
      if (playerPools?.length > 0) {
        pool = {
          poolId: playerPools[0].id,
          users: playerPools.map((p) => p.userId),
        };
      }

      if (getUsers) {
        // TODO: Grab all user data for the user ids returned from the pool
        // if this flag is passed
      }

      return Promise.resolve(pool);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Creates a new player pool with the associated user ids
   * @param userIds Array of user ids to add to the pool
   * @returns object containing the PlayerPool id and the list of userIds added
   */
  async create(userIds: number[]): Promise<object> {
    try {
      const pool = await this.database.PostgresClient.begin(async (sql) => {
        const uuid = randomUUID();
        const [p]: [PlayerPool?] = await sql`
            INSERT INTO player_pools (id, user_id) VALUES (${uuid}, ${userIds[0]}) RETURNING id
        `;

        const rest = userIds.slice(1);
        if (p && rest.length > 0) {
          const queries = rest.map((id) => this.addUser(id, p.id, sql));
          await Promise.all(queries);
        }

        return p;
      });

      return Promise.resolve({
        id: pool?.id,
        userIds,
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async addUser(
    userId: number,
    poolId: string,
    sql?: postgres.TransactionSql<any>,
  ): Promise<boolean> {
    try {
      const client = sql ? sql : this.database.PostgresClient;
      const res = await client`
            INSERT INTO player_pools (id, user_id) 
            VALUES (${poolId}, ${userId}) 
            RETURNING *
        `;

      return Promise.resolve(res && res.length > 0);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async removeUser(userId: number): Promise<boolean> {
    try {
      const res = await this.database.PostgresClient`
            DELETE FROM player_pools 
            WHERE user_id = ${userId} 
            RETURNING *
        `;

      return Promise.resolve(res && res.length > 0);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const res = await this.database.PostgresClient`
            DELETE FROM player_pools 
            WHERE id = ${id} 
            RETURNING *
        `;

      return Promise.resolve(res && res.length > 0);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
