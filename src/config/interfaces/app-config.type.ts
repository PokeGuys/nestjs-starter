import { VersionInfo } from '@common/dto/version-info';
import { AppEnvironment, Language } from '@common/enum';
import { VersioningOptions } from '@nestjs/common';
import { pino } from 'pino';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export type AppConfig = {
  debug: boolean;
  fallbackLanguage: Language;
  prefix?: string;
  env: AppEnvironment;
  host: string;
  version: VersionInfo;
  versioningOptions?: VersioningOptions;
  corsOptions?: CorsOptions;
  logger: {
    enabled: boolean;
    level: pino.LevelWithSilent;
    redact: string[];
  };
};
