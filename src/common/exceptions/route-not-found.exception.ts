import { ApiException } from '@common/exceptions/api.exception';
import { ApiProperty } from '@nestjs/swagger';
import { ERROR_CODE_DESCRIPTION } from '@common/constants/swagger.constants';
import { HttpStatus } from '@nestjs/common';
import { ROUTE_NOT_FOUND } from '@common/constants/exception.constants';

export class RouteNotFoundException extends ApiException {
  @ApiProperty({
    description: ERROR_CODE_DESCRIPTION,
    default: ROUTE_NOT_FOUND,
  })
  public readonly error!: string;

  constructor() {
    super({ code: ROUTE_NOT_FOUND }, HttpStatus.NOT_FOUND);
  }
}
