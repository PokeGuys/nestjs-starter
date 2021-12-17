import { MikroOrmHealthIndicator, RedisHealthIndicator } from '@modules/health/indicators';

import { HealthController } from '@modules/health/health.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [TerminusModule, MikroOrmModule],
  controllers: [HealthController],
  providers: [MikroOrmHealthIndicator, RedisHealthIndicator],
})
export class HealthModule {}
