import {
  HttpStatus,
  Controller,
  Param,
  Query,
  Res,
  Get,
  Body,
  Delete,
  Post,
} from '@nestjs/common';
import { Logger } from '../../../common/logger/logger.service';
import { PlayerPoolsRepo } from './player-pools.repo';
import { Response } from 'express';
import {
  PLAYER_POOLS_DELETE_DB_ERROR,
  PLAYER_POOLS_GET_DB_ERROR,
} from './player-pools.errors';
import { GenerateLoggingErrorMessage } from '../../../common/errors/error.utils';
import { CreatePool } from './dto/createPool.dto';
import { PlayerPoolsService } from './player-pools.service';

@Controller({
  path: 'pools',
})
export class PlayerPoolsController {
  constructor(
    private readonly logger: Logger,
    private readonly repo: PlayerPoolsRepo,
    private readonly service: PlayerPoolsService,
  ) {}

  @Get()
  async getAll(@Res() res: Response, @Query('getUsers') getUsers: any) {
    await this.repo
      .getAll(getUsers)
      .then((pools) => {
        return res
          .status(HttpStatus.OK)
          .json(this.service.mapPlayerPoolsToBulk(pools));
      })
      .catch((err) => {
        const errMessage = PLAYER_POOLS_GET_DB_ERROR;
        this.logger.error(
          GenerateLoggingErrorMessage(
            'Failed to get player pool from the DB',
            err,
            errMessage.code,
          ),
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errMessage);
      });
  }

  @Get(':poolId')
  async getById(
    @Param('poolId') poolId: any,
    @Res() res: Response,
    @Query('getUsers') getUsers: any,
  ) {
    await this.repo
      .getPoolById(poolId, getUsers)
      .then((pool) => {
        return res
          .status(pool ? HttpStatus.OK : HttpStatus.NOT_FOUND)
          .json(pool);
      })
      .catch((err) => {
        const errMessage = PLAYER_POOLS_GET_DB_ERROR;
        this.logger.error(
          GenerateLoggingErrorMessage(
            'Failed to get player pool from the DB',
            err,
            errMessage.code,
          ),
        );
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json(PLAYER_POOLS_GET_DB_ERROR);
      });
  }

  @Post()
  async create(@Body() body: CreatePool, @Res() res: Response) {
    await this.repo
      .create(body.userIds)
      .then((created) => {
        return res.status(HttpStatus.OK).json(created);
      })
      .catch((err) => {
        const errMessage = this.service.getCreatePlayerPoolError(err);
        this.logger.error(
          GenerateLoggingErrorMessage(
            'Failed to add player pool to the DB',
            err,
            errMessage.code,
          ),
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errMessage);
      });
  }

  @Delete(':poolId')
  async delete(@Param('poolId') id: any, @Res() res: Response) {
    await this.repo
      .delete(id)
      .then((deleted) => {
        return res
          .status(deleted ? HttpStatus.OK : HttpStatus.NOT_FOUND)
          .json();
      })
      .catch((err) => {
        const errMessage = PLAYER_POOLS_DELETE_DB_ERROR;

        this.logger.error(
          GenerateLoggingErrorMessage(
            'Failed to remove user from DB',
            err,
            errMessage.code,
          ),
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errMessage);
      });
  }
}
