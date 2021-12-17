import { BootstrapModule } from '@common/bootstrap.module';
import { CommandModule } from 'nestjs-command';
import { GenerateSwaggerCommand } from '@commands/generate-swagger.command';
import { Module } from '@nestjs/common';

@Module({
  imports: [BootstrapModule, CommandModule],
  providers: [GenerateSwaggerCommand],
})
export class CliCommandModule {}
