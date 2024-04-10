import { ErrorMessage } from '../../../common/errors/error.message';

export const PLAYER_POOLS_GET_DB_ERROR = new ErrorMessage(
  10040,
  'Failed to get player pool from records',
);

export const PLAYER_POOLS_CREATE_DB_ERROR = new ErrorMessage(
  10041,
  'Failed to create player pool in the records',
);

export const PLAYER_POOLS_CREATE_VALIDATION_ERROR = (
  err: string,
): ErrorMessage => {
  return new ErrorMessage(
    10043,
    `Validation error occurred while creating player pool: ${err}`,
  );
};

export const PLAYER_POOLS_DELETE_DB_ERROR = new ErrorMessage(
  10044,
  'Failed to delete player pool from the records',
);
