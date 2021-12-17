import { APP_CONFIG_NAMESPACE, HTTP_CONFIG_NAMESPACE } from '@common/constants/config.constants';

import { BaseConfig } from '@config/interfaces';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { setupApplication } from '@src/app';
import { setupSwagger } from '@common/swagger';

async function bootstrap() {
  // Setup nest application
  const app = await setupApplication();
  const cfg = app.get<ConfigService<BaseConfig, true>>(ConfigService);
  const { debug } = cfg.get(APP_CONFIG_NAMESPACE, { infer: true });
  const { host, port } = cfg.get(HTTP_CONFIG_NAMESPACE, { infer: true });

  // Setup SwaggerModule if debug mode is enabled
  if (debug) {
    setupSwagger(app);
  }

  // start application
  await app
    .listen(port, host)
    .then(() => app.getUrl())
    .then((url) => Logger.log(`application running on ${url}`));
}

bootstrap();
