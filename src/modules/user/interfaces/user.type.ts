import { UserStatus } from '@common/enum';
import { IEntityType } from '@common/models';

export type UserType = IEntityType & {
  status: UserStatus;
  email: string;
  password: string;
};
