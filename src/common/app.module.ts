import { AppController } from '@common/app.controller';
import { BootstrapModule } from '@common/bootstrap.module';
import { HealthModule } from '@modules/health';
import { Module } from '@nestjs/common';
import { UserModule } from '@modules/user';

@Module({
  imports: [BootstrapModule, HealthModule, UserModule],
  controllers: [AppController],
})
export class AppModule {}
