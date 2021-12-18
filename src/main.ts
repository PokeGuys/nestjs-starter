import { APP_CONFIG_NAMESPACE, HTTP_CONFIG_NAMESPACE } from '@common/constants/config.constants';

import { setupSwagger } from '@common/swagger';
import { BaseConfig } from '@config/interfaces';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setupApplication } from '@src/app';

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
