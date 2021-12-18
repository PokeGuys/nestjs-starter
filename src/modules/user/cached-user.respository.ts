import { AbstractCachedRepository } from '@common/repositories/abstract-cached.repository';
import { InjectRedis, RedisClient } from '@libraries/redis';
import { EntityData } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from '@modules/user/models/user.entity';
import { USER_REPOSITORY_CACHE_KEY } from '@modules/user/user.constants';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CachedUserRepository extends AbstractCachedRepository<User> {
  private readonly logger = new Logger(CachedUserRepository.name);

  constructor(
    @InjectRedis() redisClient: RedisClient,
    @InjectRepository(User) private readonly userRepository: EntityRepository<User>,
  ) {
    super(redisClient, User);
  }

  public async findById(id: string): Promise<User | null> {
    const cacheKey = this.buildCacheKey(USER_REPOSITORY_CACHE_KEY, id);
    try {
      const cachedResult = await this.retrieveFromCache(cacheKey);
      if (cachedResult !== null) {
        return <User>cachedResult;
      }
    } catch (e) {
      this.logger.error(e);
    }

    const user = await this.userRepository.findOne({ id });
    if (user !== null) {
      await this.storeCache(cacheKey, user.toObject());
    }
    return user;
  }

  public async create(data: EntityData<User>): Promise<User> {
    const user = this.userRepository.create(data);
    const cacheKey = this.buildCacheKey(USER_REPOSITORY_CACHE_KEY, user.id);
    await Promise.all([
      this.userRepository.persistAndFlush(user),
      this.storeCache(cacheKey, user.toObject()),
    ]);

    return user;
  }
}
