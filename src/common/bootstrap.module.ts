import * as path from 'path';
import {
  APP_CONFIG_NAMESPACE,
  DATABASE_CONFIG_NAMESPACE,
  MONGODB_CONFIG_NAMESPACE,
  REDIS_CONFIG_NAMESPACE,
} from '@common/constants/config.constants';
import { AppEnvironment, Language } from '@common/enum';
import { validate } from '@config/env.validator';
import { BaseConfig } from '@config/interfaces';
import { appConfig, databaseConfig, httpConfig, mongodbConfig, redisConfig } from '@config/loader';
import { RedisModule } from '@libraries/redis';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nJsonParser,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { APP_PIPE, APP_FILTER } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { stdSerializers } from 'pino';
import {
  requestIdGenerator,
  customLogLevelFormatter,
  requestSerializer,
  responseSerializer,
} from '@common/util/logger.util';
import { AllExceptionFilter } from '@common/filters/all-exception.filter';

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
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<BaseConfig, true>) => {
        const appEnv = config.get('app.env', { infer: true });
        const isDeployment = [AppEnvironment.Development, AppEnvironment.Production].includes(
          appEnv,
        );
        const { enabled, level, redact } = config.get('app.logger', { infer: true });
        return {
          pinoHttp: {
            enabled,
            level,
            redact,
            prettyPrint: !isDeployment,
            genReqId: requestIdGenerator,
            customLogLevel: customLogLevelFormatter,
            serializers: {
              err: stdSerializers.err,
              req: requestSerializer,
              res: responseSerializer,
            },
          },
          exclude: [{ method: RequestMethod.ALL, path: '(.*)/(readiness|liveness)' }],
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
