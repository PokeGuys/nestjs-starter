import { ApiRateLimitedException } from '@common/exceptions';
import { ApiTooManyRequestsResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export const ApiRateLimited = () => {
  return applyDecorators(
    ApiTooManyRequestsResponse({
      description: 'This request was rate-limited',
      type: ApiRateLimitedException,
    }),
  );
};
