import { ErrorMessage } from '../../../common/errors/error.message';

export const MATCHES_GET_ALL_MATCHES_DB_ERROR = new ErrorMessage(
  10050,
  'Failed to get all matches from records',
);

export const MATCHES_GET_MATCH_DB_ERROR = new ErrorMessage(
  10051,
  'Failed to get match from records',
);

export const MATCHES_CREATE_MATCH_DB_ERROR = new ErrorMessage(
  10052,
  'Failed to create match in records',
);

export const MATCHES_CREATE_MATCH_VALIDATION_ERROR = (err: string) => {
  return new ErrorMessage(
    10053,
    `Failed to get match from records. Error: ${err}`,
  );
};

export const MATCHES_UPDATE_MATCH_DB_ERROR = new ErrorMessage(
  10054,
  'Failed to update match in records',
);

export const MATCHES_DELETE_MATCH_DB_ERROR = new ErrorMessage(
  10055,
  'Failed to delete match from records',
);
