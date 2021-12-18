import { ApiRateLimitedException } from '@common/exceptions';
import { applyDecorators } from '@nestjs/common';
import { ApiTooManyRequestsResponse } from '@nestjs/swagger';

export const ApiRateLimited = () => {
  return applyDecorators(
    ApiTooManyRequestsResponse({
      description: 'This request was rate-limited',
      type: ApiRateLimitedException,
    }),
  );
};
