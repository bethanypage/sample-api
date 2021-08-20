import Logger, { ReqId } from 'express-pino-logger';
import { v4 } from 'uuid';

import type { IncomingMessage, ServerResponse } from 'http';

function generateCorrelationId(req: IncomingMessage): ReqId {
  return req.headers['x-request-id'] ?? v4();
}

function handleLogLevels(res: ServerResponse, err: Error) {
  if (res.statusCode >= 400 && res.statusCode < 500) return 'warn';
  else if (res.statusCode >= 500 || err) return 'error';

  return 'info';
}

export const initialiseLogging = () => {
  return Logger({
    genReqId: generateCorrelationId,
    customLogLevel: handleLogLevels,
  });
};
