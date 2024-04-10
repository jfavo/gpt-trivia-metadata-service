import { ErrorMessage } from 'src/common/errors/error.message';

export const FRIENDS_GET_ALL_FRIENDS_DB_ERROR = new ErrorMessage(
  10020,
  'Failed to retrieve all friend records for user',
);

export const FRIENDS_CREATE_FRIEND_DB_ERROR = new ErrorMessage(
  10021,
  'Failed to create friend data in records',
);

export const FRIENDS_CREATE_FRIEND_VALIDATION_ERROR = (
  err: string,
): ErrorMessage =>
  new ErrorMessage(
    10022,
    `Validation error while creating friend record: ${err}`,
  );

export const FRIENDS_DELETE_FRIEND_DB_ERROR = new ErrorMessage(
  10023,
  'Failed to create friend data in records',
);

export const FRIENDS_DELETE_FRIEND_VALIDATION_ERROR = (
  err: string,
): ErrorMessage =>
  new ErrorMessage(
    10024,
    `Validation error while deleting friend record: ${err}`,
  );
