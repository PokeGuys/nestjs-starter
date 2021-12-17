import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import {
  PAGINATION_DEFAULT_COUNT,
  PAGINATION_MAXIMUM_COUNT,
  PAGINATION_MINIMUM_COUNT,
} from '@common/constants/pagination.constants';
import {
  PAGINATION_PAGE_TOKEN_DESCRIPTION,
  PAGINATION_PAGE_TOKEN_EXAMPLE,
} from '@common/constants/swagger.constants';

import { ApiProperty } from '@nestjs/swagger';

export class CursorPaginationQuery {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: PAGINATION_PAGE_TOKEN_DESCRIPTION,
    default: PAGINATION_DEFAULT_COUNT,
    minimum: PAGINATION_MINIMUM_COUNT,
    maximum: PAGINATION_MAXIMUM_COUNT,
  })
  public readonly count = PAGINATION_DEFAULT_COUNT;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: PAGINATION_PAGE_TOKEN_DESCRIPTION,
    example: PAGINATION_PAGE_TOKEN_EXAMPLE,
  })
  public readonly pageToken!: string;
}
