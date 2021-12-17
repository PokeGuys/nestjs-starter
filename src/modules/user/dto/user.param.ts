import { IsNotEmpty, IsUUID } from 'class-validator';

export class UserParam {
  @IsUUID(4)
  @IsNotEmpty()
  public readonly userId!: string;
}
