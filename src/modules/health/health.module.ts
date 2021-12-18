import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HealthController } from '@modules/health/health.controller';
import { MikroOrmHealthIndicator, RedisHealthIndicator } from '@modules/health/indicators';

import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [TerminusModule, MikroOrmModule],
  controllers: [HealthController],
  providers: [MikroOrmHealthIndicator, RedisHealthIndicator],
})
export class HealthModule {}
