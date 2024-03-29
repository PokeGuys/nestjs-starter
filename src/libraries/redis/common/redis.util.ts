import { RedisClient, RedisModuleOptions } from '@libraries/redis/interfaces';
import { DEFAULT_CLIENT_NAME } from '@libraries/redis/redis.constants';
import Redis from 'ioredis';

export function getClientToken(name: string = DEFAULT_CLIENT_NAME): string {
  return name && name !== DEFAULT_CLIENT_NAME ? `${name}Connection` : DEFAULT_CLIENT_NAME;
}

export function createClient(options: RedisModuleOptions): RedisClient {
  if (options.cluster !== undefined) {
    const { nodes, ...clusterOptions } = options.cluster;
    return new Redis.Cluster(nodes, clusterOptions);
  }

  return options.uri ? new Redis(options.uri) : new Redis(options);
}
