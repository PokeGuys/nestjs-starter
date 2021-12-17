import { ApiProperty } from '@nestjs/swagger';

export class GetAppVersionApiResponse {
  @ApiProperty({
    description: 'The commit hash of an app',
    example: '869d089faa4eaa3a75f32b7dc82da8c5d5c6aafe',
  })
  public readonly commit!: string;

  @ApiProperty({
    description: 'The identifier of an app build',
    example: '577614139',
  })
  public readonly build!: string;
}
