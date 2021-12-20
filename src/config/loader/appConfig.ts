import * as fs from 'fs';
import * as path from 'path';
import { DEFAULT_VERSION, UNKNOWN, URI_VERSIONING_PREFIX } from '@common/constants/app.constants';
import { APP_CONFIG_NAMESPACE } from '@common/constants/config.constants';
import { VersionInfo } from '@common/dto/version-info';
import { AppEnvironment, Language } from '@common/enum';
import { AppConfig } from '@config/interfaces';
import { Logger, VersioningType } from '@nestjs/common';
import { registerAs } from '@nestjs/config';

const getVersion = (): VersionInfo | undefined => {
  const configPath = path.join(__dirname, '../../../VERSION.json');
  if (fs.existsSync(configPath)) {
    try {
      const data = fs.readFileSync(configPath, 'utf8');
      return <VersionInfo>JSON.parse(data);
    } catch (error) {
      Logger.error('VERSION.json file does not exist / invalid');
    }
  }

  return undefined;
};

export const appConfig = registerAs(APP_CONFIG_NAMESPACE, (): AppConfig => {
  const versionInfo = getVersion();
  const debug = !!process.env.DEBUG;
  return {
    debug,
    fallbackLanguage: process.env.FALLBACK_LANGUAGE || Language.English,
    prefix: process.env.APP_PREFIX,
    env: process.env.APP_ENV || AppEnvironment.Production,
    host: process.env.APP_HOST,
    version: {
      build: versionInfo?.build || UNKNOWN,
      commit: versionInfo?.commit || UNKNOWN,
    },
    versioningOptions: {
      type: VersioningType.URI,
      prefix: URI_VERSIONING_PREFIX,
      defaultVersion: DEFAULT_VERSION,
    },
    corsOptions: {
      origin: '*',
      methods: ['OPTIONS', 'HEAD', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    },
  };
});
