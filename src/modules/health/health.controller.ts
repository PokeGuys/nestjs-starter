import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import {
  HEALTH_CHECK_OPERATION_DESCRIPTION,
  HEALTH_CHECK_OPERATION_SUMMARY,
} from '@common/constants/swagger.constants';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { HEALTH_MIKROORM_KEY, HEALTH_MONGODB_KEY, HEALTH_REDIS_KEY } from './health.constants';
import { MikroOrmHealthIndicator, RedisHealthIndicator } from './indicators';

@Controller('health')
@ApiTags('Health Check')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly dbIndicator: MikroOrmHealthIndicator,
    private readonly mongooseIndicator: MongooseHealthIndicator,
    private readonly redisIndicator: RedisHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: HEALTH_CHECK_OPERATION_SUMMARY,
    description: HEALTH_CHECK_OPERATION_DESCRIPTION,
  })
  public async check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.dbIndicator.pingCheck(HEALTH_MIKROORM_KEY),
      () => this.redisIndicator.pingCheck(HEALTH_REDIS_KEY),
      () => this.mongooseIndicator.pingCheck(HEALTH_MONGODB_KEY),
    ]);
  }
}
