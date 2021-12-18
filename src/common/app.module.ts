import { AppController } from '@common/app.controller';
import { BootstrapModule } from '@common/bootstrap.module';
import { HealthModule } from '@modules/health';
import { UserModule } from '@modules/user';
import { Module } from '@nestjs/common';

@Module({
  imports: [BootstrapModule, HealthModule, UserModule],
  controllers: [AppController],
})
export class AppModule {}
