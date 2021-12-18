import { createClient, getClientToken } from '@libraries/redis/common';
import {
  RedisModuleAsyncOptions,
  RedisModuleOptions,
  RedisOptionsFactory,
} from '@libraries/redis/interfaces';
import { REDIS_MODULE_OPTIONS } from '@libraries/redis/redis.constants';
import {
  DynamicModule,
  Global,
  Inject,
  Module,
  OnApplicationShutdown,
  Provider,
  Type,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Redis } from 'ioredis';

@Global()
@Module({})
export class RedisCoreModule implements OnApplicationShutdown {
  constructor(
    @Inject(REDIS_MODULE_OPTIONS)
    private readonly options: RedisModuleOptions,
    private readonly moduleRef: ModuleRef,
  ) {}

  static forRoot(options: RedisModuleOptions): DynamicModule {
    const redisModuleOptions = {
      provide: REDIS_MODULE_OPTIONS,
      useValue: options,
    };
    const connectionProvider = {
      provide: getClientToken(options.connectionName),
      useValue: createClient(options),
    };
    return {
      module: RedisCoreModule,
      providers: [connectionProvider, redisModuleOptions],
      exports: [connectionProvider],
    };
  }

  static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    const connectionProvider = {
      provide: getClientToken(options.name),
      useFactory: (redisOptions: RedisModuleOptions) => {
        return createClient(redisOptions);
      },
      inject: [REDIS_MODULE_OPTIONS],
    };
    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: RedisCoreModule,
      imports: options.imports,
      providers: [...asyncProviders, connectionProvider],
      exports: [connectionProvider],
    };
  }

  onApplicationShutdown(): void {
    const connection = this.moduleRef.get<Redis>(getClientToken(this.options.connectionName));
    if (connection && !this.options.keepAlive) {
      connection.disconnect();
    }
  }

  private static createAsyncProviders(options: RedisModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<RedisOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(options: RedisModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: REDIS_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    const inject = [(options.useClass || options.useExisting) as Type<RedisOptionsFactory>];
    return {
      provide: REDIS_MODULE_OPTIONS,
      useFactory: async (optionsFactory: RedisOptionsFactory) =>
        optionsFactory.createRedisOptions(options.name),
      inject,
    };
  }
}
