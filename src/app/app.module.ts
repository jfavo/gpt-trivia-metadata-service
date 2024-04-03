import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { LoggerMiddleware } from '../common/middleware/logger.middleware';
import { UsersModule } from './modules/users/users.module';
import { LoggerModule } from '../common/logger/logger.module';

@Module({
  imports: [UsersModule, LoggerModule],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
