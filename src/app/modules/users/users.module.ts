import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserRepo } from './users.repo';
import { DatabaseModule } from 'src/database/database.module';
import { LoggerModule } from 'src/common/logger/logger.module';

@Module({
  imports: [DatabaseModule, LoggerModule],
  controllers: [UserController],
  providers: [UserRepo],
})
export class UsersModule {}
