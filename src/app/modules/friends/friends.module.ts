import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module';
import { LoggerModule } from '../../../common/logger/logger.module';
import { FriendsController } from './friends.controller';
import { FriendsRepo } from './friends.repo';
import { FriendsService } from './friends.service';

@Module({
  imports: [DatabaseModule, LoggerModule],
  controllers: [FriendsController],
  providers: [FriendsRepo, FriendsService],
})
export class FriendsModule {}
