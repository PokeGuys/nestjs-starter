import { UserStatus } from '@common/enum/user-status.enum';

export interface BaseUser {
  id: string;
  status: UserStatus;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
