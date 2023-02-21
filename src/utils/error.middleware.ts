import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@nestjs/common';
import { logger } from './logger';
import { ErrResponse } from './utils';

const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const status: number = error.getStatus() || 500;
    const message: string = error.message || 'Something went wrong';

    logger.error(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`,
    );
    return ErrResponse(error);
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
