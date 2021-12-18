import { existsSync, mkdirSync, writeFileSync } from 'fs';
import * as path from 'path';
import { createSwaggerDocument } from '@common/swagger';
import { Injectable, Logger } from '@nestjs/common';
import { setupApplication } from '@src/app';
import { Command } from 'nestjs-command';

@Injectable()
export class GenerateSwaggerCommand {
  @Command({
    command: 'generate:swagger',
    describe: 'Generate a swagger specification',
  })
  public async generate(): Promise<void> {
    const app = await setupApplication();
    const document = createSwaggerDocument(app);
    const destination = path.join(__dirname, '../../docs');
    if (!existsSync(destination)) {
      mkdirSync(destination);
    }
    writeFileSync(`${destination}/swagger.json`, JSON.stringify(document), {
      encoding: 'utf8',
    });

    Logger.log('Swagger specification generated.', GenerateSwaggerCommand.name);
  }
}
