import { ErrorRequestHandler } from 'express';

export function errorHandlingMiddleware(): ErrorRequestHandler {
  return (err, req, res, next) => {
    const logger = res.locals.getLogger('cs:api.error');

    logger.error('Uncaught Exception', req.url, err);
    next();
  };
}
