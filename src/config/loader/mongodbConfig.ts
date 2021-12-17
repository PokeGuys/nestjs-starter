import { MONGODB_CONFIG_NAMESPACE } from '@common/constants/config.constants';
import { MongodbConfig } from '@config/interfaces';
import { registerAs } from '@nestjs/config';

export const mongodbConfig = registerAs(MONGODB_CONFIG_NAMESPACE, (): MongodbConfig => {
  return {
    uri: process.env.MONGODB_URI,
  };
});
