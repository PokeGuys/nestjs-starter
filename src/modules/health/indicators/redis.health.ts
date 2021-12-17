import {
  ConnectionNotFoundError,
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
  TimeoutError,
} from '@nestjs/terminus';
import { Injectable, Scope } from '@nestjs/common';
import { TimeoutError as PromiseTimeoutError, promiseTimeout } from '@nestjs/terminus/dist/utils';

import { DEFAULT_HEALTH_CHECK_TIMEOUT } from '@modules/health/health.constants';
import { ModuleRef } from '@nestjs/core';
import { RedisClient } from '@libraries/redis/interfaces';
import { getClientToken } from '@libraries/redis/common';

export interface RedisPingCheckSettings {
  /**
   * The connection which the ping check should get executed
   */
  connection?: RedisClient;

  /**
   * The amount of time the check should require in ms
   */
  timeout?: number;
}

@Injectable({ scope: Scope.TRANSIENT })
export class RedisHealthIndicator extends HealthIndicator {
  constructor(private moduleRef: ModuleRef) {
    super();
  }

  private getContextConnection(): RedisClient | null {
    try {
      return this.moduleRef.get(getClientToken(), {
        strict: false,
      });
    } catch (err) {
      return null;
    }
  }

  private async pingDb(connection: RedisClient, timeout: number) {
    return promiseTimeout(timeout, connection.ping());
  }

  public async pingCheck(
    key: string,
    options: RedisPingCheckSettings = {},
  ): Promise<HealthIndicatorResult> {
    let isHealthy = false;
    const connection = options.connection || this.getContextConnection();
    const timeout = options.timeout || DEFAULT_HEALTH_CHECK_TIMEOUT;

    if (!connection) {
      throw new ConnectionNotFoundError(
        this.getStatus(key, isHealthy, {
          message: 'Connection provider not found in application context',
        }),
      );
    }

    try {
      await this.pingDb(connection, timeout);
      isHealthy = true;
    } catch (err) {
      if (err instanceof PromiseTimeoutError) {
        throw new TimeoutError(
          timeout,
          this.getStatus(key, isHealthy, {
            message: `timeout of ${timeout}ms exceeded`,
          }),
        );
      }
    }

    if (isHealthy) {
      return this.getStatus(key, isHealthy);
    }
    throw new HealthCheckError(`${key} is not available`, this.getStatus(key, isHealthy));
  }
}
