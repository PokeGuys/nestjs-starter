import { DEFAULT_REDIS_PORT, REDIS_CONFIG_NAMESPACE } from '@common/constants/config.constants';

import { DECIMAL_RADIX_BASE } from '@common/constants/common.constants';
import { RedisConfig } from '@config/interfaces';
import { registerAs } from '@nestjs/config';

export const redisConfig = registerAs(REDIS_CONFIG_NAMESPACE, (): RedisConfig => {
  let database: number | undefined;
  const port = parseInt(process.env.REDIS_PORT || DEFAULT_REDIS_PORT, DECIMAL_RADIX_BASE);
  if (process.env.REDIS_DATABASE) {
    database = parseInt(process.env.REDIS_DATABASE, DECIMAL_RADIX_BASE);
  }
  return {
    port,
    database,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    maxRetries: 3,
  };
});
