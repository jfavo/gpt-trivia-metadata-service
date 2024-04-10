import { Injectable } from '@nestjs/common';
import { FriendRequestsRepo } from './friend-requests.repo';
import { FriendRequest } from './dto/friend-request.dto';
import { IsPostgresUniqueViolation } from 'src/common/errors/error.utils';
import { FRIEND_REQUEST_CREATE_REQUEST_VALIDATION_ERROR } from './friend-requests.errors';

export enum RequestType {
  All,
  Requested,
  Requesting,
}

@Injectable()
export class FriendRequestsService {
  constructor(private readonly repo: FriendRequestsRepo) {}

  async getFriendRequests(
    type: RequestType,
    userId: number,
  ): Promise<FriendRequest[]> {
    switch (type) {
      case RequestType.Requested:
        return this.repo.getAllRecievedFriendRequests(userId);
      case RequestType.Requesting:
        return this.repo.getAllSentFriendRequests(userId);
      default:
        return this.repo.getAllFriendRequests(userId);
    }
  }

  handleCreateUserError(err): ErrorMessage {
    if (IsPostgresUniqueViolation(err)) {
      console.log(err);
      const violatedKey = err.detail.includes('users_username_key')
        ? 'username'
        : 'email';
      return FRIEND_REQUEST_CREATE_REQUEST_VALIDATION_ERROR(
        `Friend request with the ${violatedKey} already exists in the records`,
      );
    }

    return CREATE_USER_DB_ERROR;
  }
}
