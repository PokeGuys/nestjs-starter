import { IEntity } from '@common/models';
import { UserStatus } from '@common/enum';

export type UserType = IEntity & {
  status: UserStatus;
  email: string;
  password: string;
};
