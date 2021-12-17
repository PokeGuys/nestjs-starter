import { ApiException } from '@common/exceptions/api.exception';
import { ApiProperty } from '@nestjs/swagger';
import { ERROR_CODE_DESCRIPTION } from '@common/constants/swagger.constants';
import { HttpStatus } from '@nestjs/common';
import { UNAUTHORIZED_ACCESS } from '@common/constants/exception.constants';

export class UnauthorizedAccessException extends ApiException {
  @ApiProperty({
    description: ERROR_CODE_DESCRIPTION,
    default: UNAUTHORIZED_ACCESS,
  })
  public readonly error!: string;

  constructor() {
    super({ code: UNAUTHORIZED_ACCESS }, HttpStatus.UNAUTHORIZED);
  }
}
