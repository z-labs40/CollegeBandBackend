import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../../shared/error';
import { Logger } from '../../shared/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Log unexpected errors
  Logger.error(`${err.name}: ${err.message}\n${err.stack}`);

  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong on the server',
  });
};
