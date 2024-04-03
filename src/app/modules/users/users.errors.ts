import { ErrorMessage } from '../../../common/errors/error.message';

export const GET_USER_BY_ID_ERROR = new ErrorMessage(
  10000,
  'Failed to get user. User does not exist for the ID passed',
);

export const GET_USER_BY_ID_DB_ERROR = new ErrorMessage(
  10001,
  'Failed to get user from records',
);

export const GET_USERS_ERROR = new ErrorMessage(10002, 'Failed to get users');

export const GET_USERS_DB_ERROR = new ErrorMessage(
  10003,
  'Failed to get users from records',
);

export const CREATE_USER_ERROR = new ErrorMessage(
  10004,
  'Failed to create user',
);

export const CREATE_USER_DB_ERROR = new ErrorMessage(
  10005,
  'Failed to create user in records',
);

export const CREATE_USER_VALIDATION_ERROR = (validationErr: string) =>
  new ErrorMessage(10006, `User data was invalid: ${validationErr}`);

export const CREATE_USER_DUPLICATE_USERNAME_ERROR = new ErrorMessage(
  10014,
  'Username already exists',
);

export const CREATE_USER_DUPLICATE_EMAIL_ERROR = new ErrorMessage(
  10015,
  'Email already exists',
);

export const UPDATE_USER_NOT_FOUND_ERROR = new ErrorMessage(
  10007,
  'User does not exist for the supplied ID',
);

export const UPDATE_USER_DB_ERROR = new ErrorMessage(
  10008,
  'Failed to update user in records',
);

export const UPDATE_USER_VALIDATION_ERROR = (validationErr: string) =>
  new ErrorMessage(10009, `User data was invalid: ${validationErr}`);

export const DELETE_USER_ERROR = new ErrorMessage(
  10010,
  'Failed to delete user',
);

export const DELETE_USER_DB_ERROR = new ErrorMessage(
  10011,
  'Failed to delete use from records',
);

export const LOGIN_USER_NOT_FOUND_ERROR = new ErrorMessage(
  10012,
  'User was not found in the records',
);

export const LOGIN_USER_DB_ERROR = new ErrorMessage(
  10013,
  'Failed to fetch user from the records',
);
