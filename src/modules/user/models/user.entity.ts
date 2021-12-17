import { Entity, Property } from '@mikro-orm/core';

import { AbstractEntity } from '@common/models/abstract.entity';
import { BaseUser } from '@common/dto/base-user';
import { UserDto } from '@modules/user/dto/responses/user.dto';
import { UserStatus } from '@common/enum/user-status.enum';
import { UserType } from '@modules/user/interfaces';
import { string } from 'yargs';

@Entity()
export class User extends AbstractEntity<UserDto, UserType> implements BaseUser, UserType {
  @Property({ type: string, default: UserStatus.Active })
  public status!: UserStatus;

  @Property()
  public email!: string;

  @Property({ hidden: true })
  public password!: string;

  protected dtoClass = UserDto;

  public toObject(): UserType {
    return {
      id: this.id,
      status: this.status,
      email: this.email,
      password: this.password,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
