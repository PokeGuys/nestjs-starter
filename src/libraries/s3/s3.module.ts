import { S3ModuleAsyncOptions, S3ModuleOptions } from '@libraries/s3/interfaces';
import { S3CoreModule } from '@libraries/s3/s3-core.module';
import { DynamicModule, Module } from '@nestjs/common';

@Module({})
export class S3Module {
  static forRoot(options: S3ModuleOptions): DynamicModule {
    return {
      module: S3Module,
      imports: [S3CoreModule.forRoot(options)],
    };
  }

  static forRootAsync(options: S3ModuleAsyncOptions): DynamicModule {
    return {
      module: S3Module,
      imports: [S3CoreModule.forRootAsync(options)],
    };
  }
}
