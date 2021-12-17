import { AppEnvironment, Language } from '@common/enum';

import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { VersionInfo } from '@common/dto/version-info';
import { VersioningOptions } from '@nestjs/common';

export type AppConfig = {
  debug: boolean;
  fallbackLanguage: Language;
  prefix?: string;
  env: AppEnvironment;
  host: string;
  version: VersionInfo;
  versioningOptions?: VersioningOptions;
  corsOptions?: CorsOptions;
};
