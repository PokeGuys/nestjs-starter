/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export type ExceptionData = {
  code: string;
  payload?: Record<string, any>;
};

export abstract class ApiException extends HttpException {
  @ApiProperty({ description: 'The error message of error' })
  public readonly errorMessage!: string;

  @ApiProperty({ description: 'The error code of error' })
  public readonly error!: string;

  constructor(
    public readonly data: ExceptionData,
    public readonly statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(HttpException.createBody(ApiException.name, data.code, statusCode), statusCode);
  }
}
