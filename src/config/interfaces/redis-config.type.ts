import IORedis from 'ioredis';

export type RedisClusterConfig = {
  natMap?: IORedis.NatMap;
};

export type RedisConfig = {
  host: string;
  port: number;
  maxRetries?: number;
  password?: string;
  database?: number;
  cluster?: RedisClusterConfig;
};
