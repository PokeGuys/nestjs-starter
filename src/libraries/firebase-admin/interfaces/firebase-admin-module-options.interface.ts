import { ModuleMetadata, Type } from '@nestjs/common';

import { AppOptions } from 'firebase-admin';

export type FirebaseAdminModuleOptions = {
  name?: string;
} & AppOptions;

export interface FirebaseAdminOptionsFactory {
  createFirebaseAdminOptions(
    name?: string,
  ): Promise<FirebaseAdminModuleOptions> | FirebaseAdminModuleOptions;
}

export interface FirebaseAdminModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useExisting?: Type<FirebaseAdminOptionsFactory>;
  useClass?: Type<FirebaseAdminOptionsFactory>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useFactory?: (...args: any[]) => Promise<FirebaseAdminModuleOptions> | FirebaseAdminModuleOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inject?: any[];
}
