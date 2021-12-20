import { createClient, getClientToken } from '@libraries/firebase-admin/common';
import { FIREBASE_ADMIN_MODULE_OPTIONS } from '@libraries/firebase-admin/firebase-admin.constants';
import {
  FirebaseAdminModuleAsyncOptions,
  FirebaseAdminModuleOptions,
  FirebaseAdminOptionsFactory,
} from '@libraries/firebase-admin/interfaces';
import { DynamicModule, Global, Module, Provider, Type } from '@nestjs/common';

@Global()
@Module({})
export class FirebaseAdminCoreModule {
  static forRoot(options: FirebaseAdminModuleOptions): DynamicModule {
    const firebaseModuleOptions = {
      provide: FIREBASE_ADMIN_MODULE_OPTIONS,
      useValue: options,
    };
    const connectionProvider = {
      provide: getClientToken(options.name),
      useValue: createClient(options),
    };
    return {
      module: FirebaseAdminCoreModule,
      providers: [connectionProvider, firebaseModuleOptions],
      exports: [connectionProvider],
    };
  }

  static forRootAsync(options: FirebaseAdminModuleAsyncOptions): DynamicModule {
    const connectionProvider = {
      provide: getClientToken(options.name),
      useFactory: (firebaseOptions: FirebaseAdminModuleOptions) => {
        return createClient(firebaseOptions);
      },
      inject: [FIREBASE_ADMIN_MODULE_OPTIONS],
    };
    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: FirebaseAdminCoreModule,
      imports: options.imports,
      providers: [...asyncProviders, connectionProvider],
      exports: [connectionProvider],
    };
  }

  private static createAsyncProviders(options: FirebaseAdminModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<FirebaseAdminOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(options: FirebaseAdminModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: FIREBASE_ADMIN_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    const inject = [(options.useClass || options.useExisting) as Type<FirebaseAdminOptionsFactory>];
    return {
      provide: FIREBASE_ADMIN_MODULE_OPTIONS,
      useFactory: async (optionsFactory: FirebaseAdminOptionsFactory) =>
        optionsFactory.createFirebaseAdminOptions(options.name),
      inject,
    };
  }
}
