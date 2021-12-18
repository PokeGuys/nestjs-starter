import { getClientToken } from '@libraries/redis/common/redis.util';
import { Inject } from '@nestjs/common';

export const InjectRedis: (name?: string) => ParameterDecorator = (name?: string) =>
  Inject(getClientToken(name));
