import { ModuleMetadata, Type } from '@nestjs/common';
import { Cluster, ClusterOptions, NodeConfiguration, Redis, RedisOptions } from 'ioredis';

export type RedisClient = Redis | Cluster;

export type RedisClusterModuleOptions = {
  nodes: NodeConfiguration[];
} & Partial<ClusterOptions>;

export type RedisModuleOptions = {
  connectionName?: string;
  uri?: string;
  cluster?: RedisClusterModuleOptions;
} & Partial<RedisOptions>;

export interface RedisOptionsFactory {
  createRedisOptions(connectionName?: string): Promise<RedisModuleOptions> | RedisModuleOptions;
}

export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useExisting?: Type<RedisOptionsFactory>;
  useClass?: Type<RedisOptionsFactory>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useFactory?: (...args: any[]) => Promise<RedisModuleOptions> | RedisModuleOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inject?: any[];
}
