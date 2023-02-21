import { AppResponse } from 'src/shared/interfaces/app-response.interface';
import { logger } from './logger';

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (
    value !== null &&
    typeof value === 'object' &&
    !Object.keys(value).length
  ) {
    return true;
  } else {
    return false;
  }
};

export const ErrResponse = (err, res?): AppResponse => {
  logger.error(`>> StatusCode:: ${err.status}, Message:: ${err.message}`);
  return res.status(err.status).json({
    message: err.message,
    statusCode: err.status,
    timestamp: new Date().toISOString(),
  });
};

export const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  // currentPage++;
  return { totalItems, rows, totalPages, currentPage };
};

export const getPagination = (page, size) => {
  page--;
  const limit = size ? +size : 6;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};
