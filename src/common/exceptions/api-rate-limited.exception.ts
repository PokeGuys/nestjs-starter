import { API_RATE_LIMITED } from '@common/constants/exception.constants';
import { ERROR_CODE_DESCRIPTION } from '@common/constants/swagger.constants';
import { ApiException } from '@common/exceptions/api.exception';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ApiRateLimitedException extends ApiException {
  @ApiProperty({
    description: ERROR_CODE_DESCRIPTION,
    default: API_RATE_LIMITED,
  })
  public readonly error!: string;

  constructor(waitUntil: number) {
    super({ code: API_RATE_LIMITED, payload: { waitUntil } }, HttpStatus.TOO_MANY_REQUESTS);
  }
}
