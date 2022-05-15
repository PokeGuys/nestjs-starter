import type { NatMap } from 'ioredis';

export type RedisClusterConfig = {
  natMap?: NatMap;
};

export type RedisConfig = {
  host: string;
  port: number;
  maxRetries?: number;
  password?: string;
  database?: number;
  cluster?: RedisClusterConfig;
};
