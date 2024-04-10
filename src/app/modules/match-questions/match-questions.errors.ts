import { ErrorMessage } from '../../../common/errors/error.message';

export const MATCH_QUESTIONS_GET_BY_SUBCATEGORY_DB_ERROR = new ErrorMessage(
  10060,
  'Failed to get questions for subcategory from records',
);

export const MATCH_QUESTIONS_GET_BY_CATEGORY_DB_ERROR = new ErrorMessage(
  10061,
  'Failed to get questions for category from records',
);

export const MATCH_QUESTIONS_GET_BY_CATEGORY_INVALID_IDS_ERROR =
  new ErrorMessage(
    10062,
    'Category IDs are required. They were either not passed, empty, or malformed',
  );

export const MATCH_QUESTIONS_CREATE_DB_ERROR = new ErrorMessage(
  10063,
  'Failed to create match question in records',
);

export const MATCH_QUESTIONS_CREATE_VALIDATION_ERROR = (
  err: string,
): ErrorMessage => {
  return new ErrorMessage(
    10064,
    `Validation error while creating match question: ${err}`,
  );
};

export const MATCH_QUESTION_DELETE_DB_ERROR = new ErrorMessage(
  10065,
  'Failed to delete match question in records',
);
