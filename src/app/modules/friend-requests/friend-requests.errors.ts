import { ErrorMessage } from '../../../common/errors/error.message';

export const FRIEND_REQUESTS_GET_ALL_REQUEST_DB_ERROR = new ErrorMessage(
  10030,
  'Failed to get friend requests from the records',
);

export const FRIEND_REQUESTS_CREATE_REQUEST_DB_ERROR = new ErrorMessage(
  10031,
  'Failed to create friend request in the records',
);

export const FRIEND_REQUEST_CREATE_REQUEST_VALIDATION_ERROR = (err: string) =>
  new ErrorMessage(
    10032,
    `Validation error occurred while trying to create Friend Request: ${err}`,
  );

export const FRIEND_REQUESTS_UPDATE_REQUEST_DB_ERROR = new ErrorMessage(
  10033,
  'Failed to update friend request in the records',
);

export const FRIEND_REQUEST_UPDATE_REQUEST_VALIDATION_ERROR = (err: string) =>
  new ErrorMessage(
    10034,
    `Validation error occurred while trying to update Friend Request: ${err}`,
  );

export const FRIEND_REQUESTS_DELETE_REQUEST_DB_ERROR = new ErrorMessage(
  10035,
  'Failed to delete friend request from the records',
);

export const FRIEND_REQUEST_DELETE_REQUEST_VALIDATION_ERROR = (err: string) =>
  new ErrorMessage(
    10036,
    `Validation error occurred while trying to delete Friend Request: ${err}`,
  );
