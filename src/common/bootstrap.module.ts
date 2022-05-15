import path from 'path';
import {
  MONGODB_CONFIG_NAMESPACE,
  APP_CONFIG_NAMESPACE,
  DATABASE_CONFIG_NAMESPACE,
  REDIS_CONFIG_NAMESPACE,
} from '@common/constants/config.constants';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { validate } from '@config/env.validator';
import { BaseConfig } from '@config/interfaces';
import { appConfig, databaseConfig, httpConfig, redisConfig, mongodbConfig } from '@config/loader';
import { Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import {
  requestIdGenerator,
  customLogLevelFormatter,
  requestSerializer,
  responseSerializer,
} from '@common/util/logger.util';
import {
  I18nModule,
  QueryResolver,
  HeaderResolver,
  AcceptLanguageResolver,
  CookieResolver,
  I18nJsonLoader,
} from 'nestjs-i18n';
import { MongooseModule } from '@nestjs/mongoose';
import { stdSerializers } from 'pino';
import { RedisModule } from '@libraries/redis';
import { Language } from './enum';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
      cache: true,
      load: [appConfig, httpConfig, databaseConfig, mongodbConfig, redisConfig],
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService<BaseConfig, true>) => {
        const { uri } = cfg.get(MONGODB_CONFIG_NAMESPACE, { infer: true });
        return { uri };
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
          loaderOptions: {
            path: path.join(__dirname, '/i18n/'),
          },
        };
      },
      loader: I18nJsonLoader,
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
        const redisCfg = configService.get(REDIS_CONFIG_NAMESPACE, {
          infer: true,
        });
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
        const { enabled, level, redact } = config.get('app.logger', {
          infer: true,
        });
        return {
          pinoHttp: {
            enabled,
            level,
            redact,
            autoLogging: true,
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
})
export class BootstrapModule {}
