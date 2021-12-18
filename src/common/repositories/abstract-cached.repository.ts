import { IEntity } from '@common/models/entity.interface';
import { RedisClient } from '@libraries/redis';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ICachedRepository } from './interfaces';

export abstract class AbstractCachedRepository<TEntity extends IEntity = IEntity>
  implements ICachedRepository
{
  protected readonly redisClient: RedisClient;

  protected readonly entity: ClassConstructor<TEntity>;

  constructor(redisClient: RedisClient, entity: ClassConstructor<TEntity>) {
    this.redisClient = redisClient;
    this.entity = entity;
  }

  public buildCacheKey(prefix: string, ...keys: Array<string>): string {
    return `${prefix}:${keys.join(':')}`;
  }

  protected async retrieveFromCache(key: string): Promise<TEntity | TEntity[] | null> {
    const cachedResult = await this.redisClient.get(key);
    if (cachedResult !== null) {
      const result = JSON.parse(cachedResult);
      return plainToInstance(this.entity, result);
    }

    return null;
  }

  protected async storeCache(key: string, entity: IEntity) {
    return this.redisClient.set(key, JSON.stringify(entity));
  }
}
