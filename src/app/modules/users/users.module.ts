import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersRepo } from './users.repo';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/database/database.module';
import { LoggerModule } from 'src/common/logger/logger.module';

@Module({
  imports: [DatabaseModule, LoggerModule],
  controllers: [UsersController],
  providers: [UsersRepo, UsersService],
})
export class UsersModule {}
