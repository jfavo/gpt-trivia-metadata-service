import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module';
import { LoggerModule } from '../../../common/logger/logger.module';
import { PlayerPoolsController } from './player-pools.controller';
import { PlayerPoolsRepo } from './player-pools.repo';
import { PlayerPoolsService } from './player-pools.service';

@Module({
  imports: [DatabaseModule, LoggerModule],
  controllers: [PlayerPoolsController],
  providers: [PlayerPoolsRepo, PlayerPoolsService],
})
export class PlayerPoolsModule {}
