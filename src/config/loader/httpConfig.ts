import {
  DEFAULT_HTTP_BIND_HOST,
  DEFAULT_HTTP_BIND_PORT,
  HTTP_CONFIG_NAMESPACE,
} from '@common/constants/config.constants';

import { DECIMAL_RADIX_BASE } from '@common/constants/common.constants';
import { HttpConfig } from '@config/interfaces';
import { registerAs } from '@nestjs/config';

export const httpConfig = registerAs(HTTP_CONFIG_NAMESPACE, (): HttpConfig => {
  const port = parseInt(process.env.PORT || DEFAULT_HTTP_BIND_PORT, DECIMAL_RADIX_BASE);
  return {
    port,
    host: process.env.HOST || DEFAULT_HTTP_BIND_HOST,
  };
});
