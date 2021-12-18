import { getClientToken } from '@libraries/firebase-admin/common/firebase-admin.util';
import { Inject } from '@nestjs/common';

export const InjectFirebase: (name?: string) => ParameterDecorator = (name?: string) =>
  Inject(getClientToken(name));
