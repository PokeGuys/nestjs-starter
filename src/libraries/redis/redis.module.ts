import { RedisModuleAsyncOptions, RedisModuleOptions } from '@libraries/redis/interfaces';

import { RedisCoreModule } from '@libraries/redis/redis-core.module';
import { DynamicModule, Module } from '@nestjs/common';

@Module({})
export class RedisModule {
  static forRoot(options: RedisModuleOptions): DynamicModule {
    return {
      module: RedisModule,
      imports: [RedisCoreModule.forRoot(options)],
    };
  }

  static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    return {
      module: RedisModule,
      imports: [RedisCoreModule.forRootAsync(options)],
    };
  }
}
