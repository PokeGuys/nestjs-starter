import { S3Client } from '@aws-sdk/client-s3';
import { S3ModuleOptions } from '@libraries/s3/interfaces';
import { DEFAULT_CLIENT_NAME } from '@libraries/s3/s3.constants';

export function getClientToken(name: string = DEFAULT_CLIENT_NAME): string {
  return name && name !== DEFAULT_CLIENT_NAME ? `${name}Connection` : DEFAULT_CLIENT_NAME;
}

export function createClient(config: S3ModuleOptions): S3Client {
  return new S3Client(config);
}
