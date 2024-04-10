import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { Friend } from './dto/friend.dto';

@Injectable()
export class FriendsRepo {
  constructor(private database: DatabaseService) {}

  /**
   * Retrieves all friends for the associated user ID
   * @param userId User ID to get the friends of
   * @returns Array of friends that are associated to the user
   */
  async getAllForUserId(userId: number): Promise<Friend[]> {
    try {
      const friends = await this.database.PostgresClient<Friend[]>`
          SELECT * FROM friends
          WHERE user_id_1 = ${userId} OR user_id_2 = ${userId}
      `;

      return Promise.resolve(friends);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Creates a friend record in the DB. Returns error if there is a duplicate entry.
   * @param friend Object containing user details to create the friend record
   * @returns The friend data if it was successfully created
   */
  async create(friend: Friend): Promise<boolean> {
    try {
      const res = await this.database.PostgresClient`
        INSERT INTO friends (user_id_1, user_id_2)
        VALUES (${friend.userId1}, ${friend.userId2})
        RETURNING *
      `;

      return Promise.resolve(res && res.length > 0);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Removes the friend from the records
   * @param friend Object containing user details to create the friend record
   * @returns If the friend record was successfully removed
   */
  async delete(friend: Friend): Promise<boolean> {
    try {
      const res = await this.database.PostgresClient`
        DELETE FROM friends
        WHERE user_id_1 = ${friend.userId1}
        AND user_id_2 = ${friend.userId2}
        RETURNING *
      `;

      return Promise.resolve(res && res.length > 0);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
