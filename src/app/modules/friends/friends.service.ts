import { ErrorMessage } from '../../../common/errors/error.message';
import {
  IsPostgresUniqueViolation,
  IsPostgresForeignKeyViolation,
} from '../../../common/errors/error.utils';
import { Injectable } from '@nestjs/common';
import {
  FRIENDS_CREATE_FRIEND_DB_ERROR,
  FRIENDS_CREATE_FRIEND_VALIDATION_ERROR,
} from './friends.errors';

@Injectable()
export class FriendsService {
  handleCreateFriendError(err): ErrorMessage {
    if (IsPostgresUniqueViolation(err)) {
      return FRIENDS_CREATE_FRIEND_VALIDATION_ERROR(
        'Friend already exists for the user ids',
      );
    }

    if (IsPostgresForeignKeyViolation(err)) {
      const userIdKey = err.detail?.includes('user_id_1')
        ? 'userId1'
        : 'userId2';
      return FRIENDS_CREATE_FRIEND_VALIDATION_ERROR(
        `User does not exist for id passed into key ${userIdKey}`,
      );
    }

    return FRIENDS_CREATE_FRIEND_DB_ERROR;
  }
}
