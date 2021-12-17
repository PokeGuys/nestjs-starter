import { Inject } from '@nestjs/common';
import { getClientToken } from '@libraries/firebase-admin/common/firebase-admin.util';

export const InjectFirebase: (name?: string) => ParameterDecorator = (name?: string) =>
  Inject(getClientToken(name));
