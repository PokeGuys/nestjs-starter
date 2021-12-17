import { S3Config } from '@config/interfaces';
import { S3_CONFIG_NAMESPACE } from '@common/constants/config.constants';
import { registerAs } from '@nestjs/config';

export const s3Config = registerAs(S3_CONFIG_NAMESPACE, (): S3Config => {
  return {
    keyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_REGION,
    bucket: process.env.AWS_S3_DEFAULT_BUCKET,
    host: process.env.AWS_S3_PUBLIC_URL,
  };
});
