import { Module } from '@nestjs/common';
import { FriendRequestsController } from './friend-requests.controller';
import { FriendRequestsRepo } from './friend-requests.repo';
import { LoggerModule } from 'src/common/logger/logger.module';
import { DatabaseModule } from 'src/database/database.module';
import { FriendRequestsService } from './friend-requests.service';

@Module({
  imports: [LoggerModule, DatabaseModule],
  controllers: [FriendRequestsController],
  providers: [FriendRequestsRepo, FriendRequestsService],
})
export class FriendRequestsModule {}
