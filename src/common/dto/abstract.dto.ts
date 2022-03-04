import { IEntityType } from '@common/models';
import { ApiProperty } from '@nestjs/swagger';
import { getUnixTime } from 'date-fns';

export class AbstractDto {
  @ApiProperty()
  public id!: string;

  @ApiProperty()
  public createdAt!: number;

  @ApiProperty()
  public updatedAt!: number;

  constructor(entity: IEntityType) {
    this.id = entity.id;
    this.createdAt = getUnixTime(entity.createdAt);
    this.updatedAt = getUnixTime(entity.updatedAt);
  }
}
