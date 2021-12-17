import { ApiNotFoundResponse } from '@nestjs/swagger';
import { EntityNotFoundException } from '@common/exceptions';
import { applyDecorators } from '@nestjs/common';

export const ApiEntityNotFound = () => {
  return applyDecorators(
    ApiNotFoundResponse({
      description: "The requested resource doesn't exist",
      type: EntityNotFoundException,
    }),
  );
};
