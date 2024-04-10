import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module';
import { LoggerModule } from '../../../common/logger/logger.module';
import { MatchesController } from './matches.controller';
import { MatchesRepo } from './matches.repo';
import { MatchesService } from './matches.service';

@Module({
  imports: [DatabaseModule, LoggerModule],
  controllers: [MatchesController],
  providers: [MatchesRepo, MatchesService],
})
export class MatchesModule {}
