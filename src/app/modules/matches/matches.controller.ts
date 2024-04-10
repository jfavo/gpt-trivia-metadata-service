import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { MatchesRepo } from './matches.repo';
import { Logger } from '../../../common/logger/logger.service';
import { Response } from 'express';
import {
  MATCHES_DELETE_MATCH_DB_ERROR,
  MATCHES_GET_ALL_MATCHES_DB_ERROR,
  MATCHES_GET_MATCH_DB_ERROR,
  MATCHES_UPDATE_MATCH_DB_ERROR,
} from './matches.errors';
import { GenerateLoggingErrorMessage } from '../../../common/errors/error.utils';
import { CreateMatch } from './dto/create-match.dto';
import { UpdateMatch } from './dto/update-match.dto';
import { MatchesService } from './matches.service';

@Controller({
  path: 'matches',
})
export class MatchesController {
  constructor(
    private readonly repo: MatchesRepo,
    private readonly service: MatchesService,
    private readonly logger: Logger,
  ) {}

  @Get()
  async getAllMatches(@Res() res: Response) {
    await this.repo
      .getAllMatches()
      .then((matches) => {
        return res.status(HttpStatus.OK).json(matches);
      })
      .catch((err) => {
        const errMessage = MATCHES_GET_ALL_MATCHES_DB_ERROR;
        this.logger.error(
          GenerateLoggingErrorMessage(
            `Failed to get matches from DB`,
            err,
            errMessage.code,
          ),
        );

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errMessage);
      });
  }

  @Get(':matchId')
  async getMatchId(@Param('matchId') matchId: any, @Res() res: Response) {
    await this.repo
      .getMatchById(matchId)
      .then((match) => {
        return res
          .status(match ? HttpStatus.OK : HttpStatus.NOT_FOUND)
          .json(match);
      })
      .catch((err) => {
        const errMessage = MATCHES_GET_MATCH_DB_ERROR;
        this.logger.error(
          GenerateLoggingErrorMessage(
            `Failed to get match from DB`,
            err,
            errMessage.code,
          ),
        );

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errMessage);
      });
  }

  @Post()
  async create(@Body() createMatch: CreateMatch, @Res() res: Response) {
    await this.repo
      .create(createMatch)
      .then((match) => {
        return res
          .status(match ? HttpStatus.CREATED : HttpStatus.NOT_FOUND)
          .json(match);
      })
      .catch((err) => {
        const errMessage = this.service.getCreateMatchesError(err);
        this.logger.error(
          GenerateLoggingErrorMessage(
            `Failed to create match in DB`,
            err,
            errMessage.code,
          ),
        );

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errMessage);
      });
  }

  @Put()
  async update(@Body() updateMatch: UpdateMatch, @Res() res: Response) {
    await this.repo
      .update(updateMatch)
      .then((match) => {
        return res
          .status(match ? HttpStatus.CREATED : HttpStatus.NOT_FOUND)
          .json(match);
      })
      .catch((err) => {
        const errMessage = MATCHES_UPDATE_MATCH_DB_ERROR;
        this.logger.error(
          GenerateLoggingErrorMessage(
            `Failed to update match in DB`,
            err,
            errMessage.code,
          ),
        );

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errMessage);
      });
  }

  @Delete(':matchId')
  async delete(@Param('matchId') matchId: any, @Res() res: Response) {
    await this.repo
      .delete(matchId)
      .then((match) => {
        return res
          .status(match ? HttpStatus.OK : HttpStatus.NOT_FOUND)
          .json(match);
      })
      .catch((err) => {
        const errMessage = MATCHES_DELETE_MATCH_DB_ERROR;
        this.logger.error(
          GenerateLoggingErrorMessage(
            `Failed to delete match from DB`,
            err,
            errMessage.code,
          ),
        );

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errMessage);
      });
  }
}
