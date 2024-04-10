import { Module } from '@nestjs/common';
import { MatchCategoriesController } from './match-categories.controller';
import { MatchCategoriesRepo } from './match-categories.repo';
import { DatabaseModule } from '../../../database/database.module';
import { LoggerModule } from '../../../common/logger/logger.module';

@Module({
  controllers: [MatchCategoriesController],
  providers: [MatchCategoriesRepo],
  imports: [DatabaseModule, LoggerModule],
})
export class MatchCategoriesModule {}
