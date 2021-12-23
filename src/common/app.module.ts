import { UserModule } from '@modules/user';
import { AppController } from '@common/app.controller';
import { BootstrapModule } from '@common/bootstrap.module';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { HealthModule } from '@modules/health';
import { APP_PIPE, APP_FILTER } from '@nestjs/core';
import { RequestIdMiddleware } from './middleware';
import { AllExceptionFilter } from './filters/all-exception.filter';

@Module({
  imports: [BootstrapModule, HealthModule, UserModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes({
      path: '(.*)',
      method: RequestMethod.ALL,
    });
  }
}
