import { Inject } from '@nestjs/common';
import { getClientToken } from './s3.util';

export const InjectS3: (name?: string) => ParameterDecorator = (name?: string) =>
  Inject(getClientToken(name));
