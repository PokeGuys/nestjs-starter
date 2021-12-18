import { EntityNotFoundException } from '@common/exceptions';
import { applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse } from '@nestjs/swagger';

export const ApiEntityNotFound = () => {
  return applyDecorators(
    ApiNotFoundResponse({
      description: "The requested resource doesn't exist",
      type: EntityNotFoundException,
    }),
  );
};
