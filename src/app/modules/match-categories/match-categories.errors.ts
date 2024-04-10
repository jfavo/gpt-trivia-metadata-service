import { ErrorMessage } from '../../../common/errors/error.message';

export const CATEGORIES_GET_ALL_DB_ERROR = new ErrorMessage(
  10070,
  'Failed to get categories from DB',
);

export const CATEGORIES_GET_BY_ID_DB_ERROR = new ErrorMessage(
  10071,
  'Failed to get category from DB',
);

export const CATEGORIES_GET_SUBCATEGORIES_BY_ID_DB_ERROR = new ErrorMessage(
  10072,
  'Failed to get subcategories from DB',
);

export const CATEGORIES_CREATE_CATEGORY_DB_ERROR = new ErrorMessage(
  10073,
  'Failed to create category in DB',
);

export const CATEGORIES_CREATE_CATEGORY_VALIDATION_ERROR = (err: string) => {
  return new ErrorMessage(
    10074,
    `Validation error while creating category: ${err}`,
  );
};

export const CATEGORIES_CREATE_SUBCATEGORY_DB_ERROR = new ErrorMessage(
  10075,
  'Failed to create subcategory in DB',
);

export const CATEGORIES_CREATE_SUBCATEGORY_VALIDATION_ERROR = (err: string) => {
  return new ErrorMessage(
    10076,
    `Validation error while creating subcategory: ${err}`,
  );
};

export const CATEGORIES_UPDATE_CATEGORY_DB_ERROR = new ErrorMessage(
  10077,
  'Failed to update subcategory in DB',
);

export const CATEGORIES_UPDATE_CATEGORY_VALIDATION_ERROR = (err: string) => {
  return new ErrorMessage(
    10078,
    `Validation error while updating category: ${err}`,
  );
};

export const CATEGORIES_UPDATE_SUBCATEGORY_DB_ERROR = new ErrorMessage(
  10079,
  'Failed to update subcategory in DB',
);

export const CATEGORIES_UPDATE_SUBCATEGORY_VALIDATION_ERROR = (err: string) => {
  return new ErrorMessage(
    10080,
    `Validation error while updating subcategory: ${err}`,
  );
};

export const CATEGORIES_DELETE_CATEGORY_DB_ERROR = new ErrorMessage(
  10081,
  'Failed to delete category from DB',
);

export const CATEGORIES_DELETE_SUBCATEGORY_DB_ERROR = new ErrorMessage(
  10082,
  'Failed to delete subcategory from DB',
);
