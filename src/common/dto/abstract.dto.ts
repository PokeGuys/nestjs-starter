import { IEntity } from '@common/models/entity.interface';
import { ApiProperty } from '@nestjs/swagger';
import { getUnixTime } from 'date-fns';

export class AbstractDto {
  @ApiProperty()
  public id!: string;

  @ApiProperty()
  public createdAt!: number;

  @ApiProperty()
  public updatedAt!: number;

  constructor(entity: IEntity) {
    this.id = entity.id;
    this.createdAt = getUnixTime(entity.createdAt);
    this.updatedAt = getUnixTime(entity.updatedAt);
  }
}
