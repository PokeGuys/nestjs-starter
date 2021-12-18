import { S3ClientConfig } from '@aws-sdk/client-s3';
import { ModuleMetadata, Type } from '@nestjs/common';

export type S3ModuleOptions = {
  name?: string;
} & Partial<S3ClientConfig>;

export interface S3OptionsFactory {
  createS3Options(connectionName?: string): Promise<S3ModuleOptions> | S3ModuleOptions;
}

export interface S3ModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useExisting?: Type<S3OptionsFactory>;
  useClass?: Type<S3OptionsFactory>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useFactory?: (...args: any[]) => Promise<S3ModuleOptions> | S3ModuleOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inject?: any[];
}
