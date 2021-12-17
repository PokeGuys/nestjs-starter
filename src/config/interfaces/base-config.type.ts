import { AppConfig } from '@config/interfaces/app-config.type';
import { DatabaseConfig } from '@config/interfaces/database-config.type';
import { HttpConfig } from '@config/interfaces/http-config.type';
import { MongodbConfig } from '@config/interfaces/mongodb-config.type';
import { RedisConfig } from '@config/interfaces/redis-config.type';

export type BaseConfig = {
  app: AppConfig;
  http: HttpConfig;
  database: DatabaseConfig;
  mongodb: MongodbConfig;
  redis: RedisConfig;
};
