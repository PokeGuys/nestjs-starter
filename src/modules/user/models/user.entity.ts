import { Entity, OptionalProps, Property } from '@mikro-orm/core';
import { string } from 'yargs';
import { BaseUser } from '@common/dto/base-user';
import { UserStatus } from '@common/enum/user-status.enum';
import { IEntity, AbstractEntity } from '@common/models';
import { UserDto } from '@modules/user/dto/responses/user.dto';
import { UserType } from '@modules/user/interfaces';

@Entity()
export class User extends AbstractEntity<UserDto, UserType> implements BaseUser, UserType {
  public [OptionalProps]?: 'status' | IEntity[typeof OptionalProps];

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
