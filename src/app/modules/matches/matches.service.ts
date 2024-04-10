import { Injectable } from '@nestjs/common';
import { ErrorMessage } from '../../../common/errors/error.message';
import { IsPostgresForeignKeyViolation } from '../../../common/errors/error.utils';
import {
  MATCHES_CREATE_MATCH_DB_ERROR,
  MATCHES_CREATE_MATCH_VALIDATION_ERROR,
} from './matches.errors';

@Injectable()
export class MatchesService {
  getCreateMatchesError(err): ErrorMessage {
    if (IsPostgresForeignKeyViolation(err)) {
      return MATCHES_CREATE_MATCH_VALIDATION_ERROR(
        `pool does not exist for supplied id`,
      );
    }
    return MATCHES_CREATE_MATCH_DB_ERROR;
  }
}
