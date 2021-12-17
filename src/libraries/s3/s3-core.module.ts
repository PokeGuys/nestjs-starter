import { DynamicModule, Global, Module, Provider, Type } from '@nestjs/common';
import { S3ModuleAsyncOptions, S3ModuleOptions, S3OptionsFactory } from '@libraries/s3/interfaces';
import { createClient, getClientToken } from '@libraries/s3/common';

import { S3_MODULE_OPTIONS } from '@libraries/s3/s3.constants';

@Global()
@Module({})
export class S3CoreModule {
  static forRoot(options: S3ModuleOptions): DynamicModule {
    const s3ModuleOptions = {
      provide: S3_MODULE_OPTIONS,
      useValue: options,
    };
    const connectionProvider = {
      provide: getClientToken(options.name),
      useValue: createClient(options),
    };
    return {
      module: S3CoreModule,
      providers: [connectionProvider, s3ModuleOptions],
      exports: [connectionProvider],
    };
  }

  static forRootAsync(options: S3ModuleAsyncOptions): DynamicModule {
    const connectionProvider = {
      provide: getClientToken(options.name),
      useFactory: (s3Options: S3ModuleOptions) => {
        return createClient(s3Options);
      },
      inject: [S3_MODULE_OPTIONS],
    };
    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: S3CoreModule,
      imports: options.imports,
      providers: [...asyncProviders, connectionProvider],
      exports: [connectionProvider],
    };
  }

  private static createAsyncProviders(options: S3ModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<S3OptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(options: S3ModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: S3_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    const inject = [(options.useClass || options.useExisting) as Type<S3OptionsFactory>];
    return {
      provide: S3_MODULE_OPTIONS,
      useFactory: async (optionsFactory: S3OptionsFactory) =>
        optionsFactory.createS3Options(options.name),
      inject,
    };
  }
}
