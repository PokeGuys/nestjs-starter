import { DECIMAL_RADIX_BASE } from '@common/constants/common.constants';
import {
  DATABASE_CONFIG_NAMESPACE,
  DEFAULT_POSTGRESQL_PORT,
} from '@common/constants/config.constants';

import { DatabaseConfig } from '@config/interfaces';
import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs(DATABASE_CONFIG_NAMESPACE, (): DatabaseConfig => {
  const port = parseInt(process.env.DB_PORT || DEFAULT_POSTGRESQL_PORT, DECIMAL_RADIX_BASE);
  return {
    port,
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dbName: process.env.DB_DATABASE,
  };
});
