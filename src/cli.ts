import { CommandModule, CommandService } from 'nestjs-command';

import { COMMAND_LINE_NAMESPACE } from '@common/constants/command.constants';
import { CliCommandModule } from '@commands/cli-command.module';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(CliCommandModule);

  try {
    await app.select(CommandModule).get(CommandService).exec();
    await app.close();
  } catch (error) {
    Logger.error(error, COMMAND_LINE_NAMESPACE);
    await app.close();
    process.exit(1);
  }
}

bootstrap();
