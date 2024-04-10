import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { FriendRequest } from '../friend-requests/dto/friend-request.dto';
import { FRIEND_REQUEST_CREATE_REQUEST_VALIDATION_ERROR } from './friend-requests.errors';

@Injectable()
export class FriendRequestsRepo {
  constructor(private database: DatabaseService) {}

  /**
   * Retrieve all friend requests were the userId is associated as the requester
   * @param userId User ID for the requester of friend requests
   * @returns Array of friend requests
   */
  async getAllSentFriendRequests(userId: number): Promise<FriendRequest[]> {
    try {
      const requests = await this.database.PostgresClient<FriendRequest[]>`
        SELECT * FROM friend_requests WHERE user_requester_id = ${userId}
      `;

      return Promise.resolve(requests);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Returns all friend requests that requests the user to become friends
   * @param userId User ID for the requested friend of the requests
   * @returns Array of friend requests
   */
  async getAllRecievedFriendRequests(userId: number): Promise<FriendRequest[]> {
    try {
      const requests = await this.database.PostgresClient<FriendRequest[]>`
        SELECT * FROM friend_requests WHERE user_requested_id = ${userId}
      `;

      return Promise.resolve(requests);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Returns all friend requests for the associated user ID
   * @param userId User ID for the requested friend of the requests
   * @returns Array of friend requests
   */
  async getAllFriendRequests(userId: number): Promise<FriendRequest[]> {
    try {
      const requests = await this.database.PostgresClient<FriendRequest[]>`
            SELECT * FROM friend_requests WHERE user_requested_id = ${userId} OR user_requester_id = ${userId}
          `;

      return Promise.resolve(requests);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Creates a row in the records for the friend request
   * @param friendRequest Object containing the User IDs of the users for the friend request
   * @returns If the friend request was successfully created
   */
  async createFriendRequest(friendRequest: FriendRequest): Promise<boolean> {
    try {
      const res = await this.database.PostgresClient.begin(async (sql) => {
        // Check if friend request already exists for the users in the DB
        const requestExists = await sql`
          SELECT * FROM friend_requests
          WHERE
            (user_requester_id = ${friendRequest.userRequestedId} AND user_requested_id = ${friendRequest.userRequesterId})
          OR
            (user_requested_id = ${friendRequest.userRequestedId} AND user_requester_id = ${friendRequest.userRequesterId})
        `;

        if (requestExists?.length > 0) {
          throw FRIEND_REQUEST_CREATE_REQUEST_VALIDATION_ERROR(
            `Friend request already exist in the DB for the supplied user ids`,
          );
        }

        // Check if friend already exist for the users in the DB
        const friendsExist = await sql`
          SELECT * FROM friends 
          WHERE 
            (user_id_1 = ${friendRequest.userRequestedId} AND user_id_2 = ${friendRequest.userRequesterId})
          OR
            (user_id_1 = ${friendRequest.userRequesterId} AND user_id_2 = ${friendRequest.userRequestedId})
        `;

        if (friendsExist?.length > 0) {
          throw FRIEND_REQUEST_CREATE_REQUEST_VALIDATION_ERROR(
            `Friends already exist in the DB for the supplied user ids`,
          );
        }

        const requestRes = await this.database.PostgresClient`
          INSERT INTO friend_requests ${this.database.PostgresClient(friendRequest)} RETURNING *
        `;
        return requestRes;
      });

      return Promise.resolve(res && res.length > 0);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Creates a row in the records for the friend request
   * @param friendRequest Object containing the User IDs of the users for the friend request
   * @returns If the friend request was successfully created
   */
  async updateFriendRequest(friendRequest: FriendRequest): Promise<boolean> {
    try {
      const res = await this.database.PostgresClient`
        UPDATE friend_requests SET
          accepted = ${friendRequest.accepted},
          rejected = ${friendRequest.rejected},
          updated_at = ${Date.now()}
        WHERE 
          (user_requested_id = ${friendRequest.userRequestedId} AND user_requester_id = ${friendRequest.userRequesterId})
        OR
          (user_requester_id = ${friendRequest.userRequesterId} AND user_requested_id = ${friendRequest.userRequestedId})
        RETURNING *
      `;

      return Promise.resolve(res && res.length > 0);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Removes a row in the records for the friend request
   * @param friendRequest Object containing the User IDs of the users for the friend request
   * @returns If the friend request was successfully deleted
   */
  async deleteFriendRequest(friendRequest: FriendRequest): Promise<boolean> {
    try {
      const res = await this.database.PostgresClient`
        DELETE FROM friend_requests
        WHERE user_requester_id = ${friendRequest.userRequesterId}
        AND user_requested_id = ${friendRequest.userRequestedId}
        RETURNING *
      `;

      return Promise.resolve(res && res.length > 0);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
