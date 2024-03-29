import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { pino } from 'pino';
import pick from 'lodash.pick';
import {
  REQUEST_ID_HEADER_NAME,
  CLOUDFRONT_HEADER_NAME,
  CLOUDFLARE_HEADER_NAME,
} from '@common/constants/logger.constants';

export const requestIdGenerator = (req: IncomingMessage): string =>
  (req.headers[REQUEST_ID_HEADER_NAME.toLowerCase()] as string) ||
  (req.headers[CLOUDFRONT_HEADER_NAME.toLowerCase()] as string) ||
  (req.headers[CLOUDFLARE_HEADER_NAME.toLowerCase()] as string) ||
  uuidv4();

export const customLogLevelFormatter = (res: ServerResponse, err: Error): pino.LevelWithSilent => {
  if (res.statusCode >= 400 && res.statusCode < 500) {
    return 'warn';
  }
  if (res.statusCode >= 500 || err) {
    return 'error';
  }
  return 'info';
};

export const requestSerializer = (req: IncomingMessage): Partial<IncomingMessage> =>
  pick(req, ['id', 'method', 'url', 'headers.content-type', 'headers.user-agent', 'headers.host']);

export const responseSerializer = (res: ServerResponse): Partial<ServerResponse> =>
  pick(res, ['statusCode', 'headers.content-type', 'headers.etag']);
