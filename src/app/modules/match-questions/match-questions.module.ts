import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module';
import { LoggerModule } from '../../../common/logger/logger.module';
import { MatchHistoriesController } from './match-questions.controller';
import { MatchQuestionsRepo } from './match-questions.repo';
import { MatchQuestionsService } from './match-questions.service';

@Module({
  imports: [DatabaseModule, LoggerModule],
  controllers: [MatchHistoriesController],
  providers: [MatchQuestionsRepo, MatchQuestionsService],
})
export class MatchQuestionsModule {}
