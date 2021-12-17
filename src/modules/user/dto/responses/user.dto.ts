import {
  USER_EMAIL_DESCRIPTION,
  USER_STATUS_DESCRIPTION,
} from '@common/constants/swagger.constants';

import { AbstractDto } from '@common/dto/abstract.dto';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@modules/user/models/user.entity';
import { UserStatus } from '@common/enum/user-status.enum';
import { mockedUser } from '@modules/user/user.mock';

export class UserDto extends AbstractDto {
  @ApiProperty({
    description: USER_STATUS_DESCRIPTION,
    example: mockedUser.status,
  })
  public readonly status!: UserStatus;

  @ApiProperty({
    description: USER_EMAIL_DESCRIPTION,
    example: mockedUser.email,
  })
  public readonly email!: string;

  constructor(user: User) {
    super(user);
    this.status = user.status;
    this.email = user.email;
  }
}
