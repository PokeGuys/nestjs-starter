import { GenerateSwaggerCommand } from '@commands/generate-swagger.command';
import { BootstrapModule } from '@common/bootstrap.module';
import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';

@Module({
  imports: [BootstrapModule, CommandModule],
  providers: [GenerateSwaggerCommand],
})
export class CliCommandModule {}
