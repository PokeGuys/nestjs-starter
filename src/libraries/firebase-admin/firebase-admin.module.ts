import { DynamicModule, Module } from '@nestjs/common';
import {
  FirebaseAdminModuleAsyncOptions,
  FirebaseAdminModuleOptions,
} from '@libraries/firebase-admin/interfaces';

import { FirebaseAdminCoreModule } from '@libraries/firebase-admin/firebase-admin-core.module';

@Module({})
export class FirebaseAdminModule {
  static forRoot(options: FirebaseAdminModuleOptions): DynamicModule {
    return {
      module: FirebaseAdminModule,
      imports: [FirebaseAdminCoreModule.forRoot(options)],
    };
  }

  static forRootAsync(options: FirebaseAdminModuleAsyncOptions): DynamicModule {
    return {
      module: FirebaseAdminModule,
      imports: [FirebaseAdminCoreModule.forRootAsync(options)],
    };
  }
}
