import { Injectable } from '@nestjs/common';
import { IsPostgresUniqueViolation } from 'src/common/errors/error.utils';
import {
  CREATE_USER_DB_ERROR,
  CREATE_USER_VALIDATION_ERROR,
  UPDATE_USER_DB_ERROR,
  UPDATE_USER_VALIDATION_ERROR,
} from './users.errors';
import { ErrorMessage } from 'src/common/errors/error.message';

@Injectable()
export class UsersService {
  handleCreateUserError(err): ErrorMessage {
    if (IsPostgresUniqueViolation(err)) {
      const violatedKey = err.detail.includes('users_username_key')
        ? 'username'
        : 'email';
      return CREATE_USER_VALIDATION_ERROR(
        `User with the ${violatedKey} already exists in the records`,
      );
    }

    return CREATE_USER_DB_ERROR;
  }

  handleUpdateUserError(err): ErrorMessage {
    if (IsPostgresUniqueViolation(err)) {
      const violatedKey = err.detail.includes('users_username_key')
        ? 'username'
        : 'email';
      return UPDATE_USER_VALIDATION_ERROR(
        `User with the ${violatedKey} already exists in the records`,
      );
    }

    return UPDATE_USER_DB_ERROR;
  }
}
