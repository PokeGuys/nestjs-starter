import { UserStatus } from '@common/enum';
import { IEntity } from '@common/models';

export type UserType = IEntity & {
  status: UserStatus;
  email: string;
  password: string;
};
