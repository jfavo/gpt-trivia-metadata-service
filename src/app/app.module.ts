import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { LoggerMiddleware } from '../common/middleware/logger.middleware';
import { UsersModule } from './modules/users/users.module';
import { LoggerModule } from '../common/logger/logger.module';
import { FriendsModule } from './modules/friends/friends.module';
import { FriendRequestsModule } from './modules/friend-requests/friend-requests.module';
import { PlayerPoolsModule } from './modules/player-pools/player-pools.module';
import { MatchesModule } from './modules/matches/matches.module';
import { MatchQuestionsModule } from './modules/match-questions/match-questions.module';
import { MatchCategoriesModule } from './modules/match-categories/match-categories.module';

@Module({
  imports: [
    UsersModule,
    FriendsModule,
    FriendRequestsModule,
    PlayerPoolsModule,
    MatchesModule,
    MatchQuestionsModule,
    MatchCategoriesModule,
    LoggerModule,
  ],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
