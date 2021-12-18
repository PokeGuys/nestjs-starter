import { AbstractDto } from '@common/dto/abstract.dto';
import { BlobType, Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ClassConstructor, ClassTransformOptions, plainToClass } from 'class-transformer';

import { v4 as uuidv4 } from 'uuid';
import { IEntity } from './entity.interface';

@Entity({ abstract: true })
export abstract class AbstractEntity<
  T extends AbstractDto = AbstractDto,
  PlainObject extends IEntity = IEntity,
> implements IEntity
{
  @PrimaryKey({ type: BlobType })
  public id: string = uuidv4();

  @Property()
  public createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  protected abstract dtoClass: ClassConstructor<T>;

  public toDto(options?: ClassTransformOptions): T {
    return plainToClass(this.dtoClass, this, options);
  }

  public abstract toObject(): PlainObject;
}
