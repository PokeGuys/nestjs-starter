import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { APP_CONFIG_NAMESPACE } from '@common/constants/config.constants';
import { AppModule } from '@common/app.module';
import { BaseConfig } from '@config/interfaces';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

export const setupApplication = async (): Promise<INestApplication> => {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const cfg = app.get<ConfigService<BaseConfig, true>>(ConfigService);
  const { prefix, corsOptions, versioningOptions } = cfg.get(APP_CONFIG_NAMESPACE, { infer: true });

  // Setup API prefix
  if (prefix) {
    app.setGlobalPrefix(prefix);
  }

  // Enable CORS
  app.enableCors(corsOptions);

  // Setup API versioning
  app.enableVersioning(versioningOptions);

  // Setup shutdown hook
  app.enableShutdownHooks();

  return app;
};
