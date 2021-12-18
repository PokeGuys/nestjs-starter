import * as path from 'path';
import { Language } from '@common/enum';
import { AllExceptionFilter } from '@common/filters/all-exception.filter';
import { ValidationPipe } from '@common/pipes/validation.pipe';
import { validate } from '@config/env.validator';
import { BaseConfig } from '@config/interfaces';
import { appConfig, databaseConfig, httpConfig, mongodbConfig, redisConfig } from '@config/loader';
import { RedisModule } from '@libraries/redis';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nJsonParser,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import {
  APP_CONFIG_NAMESPACE,
  DATABASE_CONFIG_NAMESPACE,
  MONGODB_CONFIG_NAMESPACE,
  REDIS_CONFIG_NAMESPACE,
} from './constants/config.constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
      cache: true,
      load: [appConfig, httpConfig, mongodbConfig, redisConfig, databaseConfig],
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService<BaseConfig, true>) => {
        const mongodb = cfg.get(MONGODB_CONFIG_NAMESPACE, { infer: true });
        return {
          uri: mongodb.uri,
        };
      },
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService<BaseConfig, true>) => {
        const dbCfg = cfg.get(DATABASE_CONFIG_NAMESPACE, { infer: true });
        return {
          host: dbCfg.host,
          port: dbCfg.port,
          user: dbCfg.username,
          password: dbCfg.password,
          dbName: dbCfg.dbName,
          type: 'postgresql',
          entities: ['./dist/**/models/*.entity.js'],
          entitiesTs: ['./src/**/models/*.entity.ts'],
        };
      },
    }),
    I18nModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return {
          fallbackLanguage: config.get<string>('app.fallbackLanguage', Language.English),
          parserOptions: {
            path: path.join(__dirname, '/i18n/'),
          },
        };
      },
      parser: I18nJsonParser,
      resolvers: [
        { use: QueryResolver, options: ['lang', 'locale', 'l'] },
        new HeaderResolver(['x-locale']),
        AcceptLanguageResolver,
        new CookieResolver(['lang', 'locale', 'l']),
      ],
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<BaseConfig, true>) => {
        const appCfg = configService.get(APP_CONFIG_NAMESPACE, { infer: true });
        const redisCfg = configService.get(REDIS_CONFIG_NAMESPACE, { infer: true });
        if (redisCfg.cluster) {
          return {
            cluster: {
              nodes: [{ host: redisCfg.host, port: redisCfg.port }],
              natMap: appCfg.debug ? redisCfg.cluster.natMap : undefined,
            },
          };
        }

        return {
          host: redisCfg.host,
          port: redisCfg.port,
          password: redisCfg.password,
          db: redisCfg.database,
          maxRetriesPerRequest: redisCfg.maxRetries,
        };
      },
    }),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class BootstrapModule {}
