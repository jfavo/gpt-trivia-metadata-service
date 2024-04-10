import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Logger } from '../../../common/logger/logger.service';
import { MatchQuestionsRepo } from './match-questions.repo';
import { Response } from 'express';
import {
  MATCH_QUESTIONS_CREATE_DB_ERROR,
  MATCH_QUESTIONS_GET_BY_CATEGORY_DB_ERROR,
  MATCH_QUESTIONS_GET_BY_CATEGORY_INVALID_IDS_ERROR,
  MATCH_QUESTIONS_GET_BY_SUBCATEGORY_DB_ERROR,
  MATCH_QUESTION_DELETE_DB_ERROR,
} from './match-questions.errors';
import { GenerateLoggingErrorMessage } from '../../../common/errors/error.utils';
import { MatchQuestionsService } from './match-questions.service';
import { CreateQuestion } from './dto/create-question.dto';

@Controller()
export class MatchHistoriesController {
  constructor(
    private readonly repo: MatchQuestionsRepo,
    private readonly service: MatchQuestionsService,
    private readonly logger: Logger,
  ) {}

  @Get('categories/:categoryId/subcategories/:subcategoryId/questions')
  async getBySubcategoryId(
    @Param('categoryId') categoryId: any,
    @Param('subcategoryId') subcategoryId: any,
    @Res() res: Response,
  ) {
    await this.repo
      .getBySubcategoryId(subcategoryId)
      .then((questions) => {
        return res
          .status(questions ? HttpStatus.OK : HttpStatus.NOT_FOUND)
          .json(questions);
      })
      .catch((err) => {
        const errMessage = MATCH_QUESTIONS_GET_BY_SUBCATEGORY_DB_ERROR;
        this.logger.error(
          GenerateLoggingErrorMessage(
            'Failed to get match questions for subcategory from DB',
            err,
            errMessage.code,
          ),
        );
      });
  }

  @Get('categories/:categoryId/questions')
  async getByCategoryId(
    @Param('categoryId') categoryId: number,
    @Res() res: Response,
  ) {
    await this.repo
      .getByCategoryIds(categoryId)
      .then((questions) => {
        return res
          .status(questions ? HttpStatus.OK : HttpStatus.NOT_FOUND)
          .json(questions);
      })
      .catch((err) => {
        const errMessage = MATCH_QUESTIONS_GET_BY_CATEGORY_DB_ERROR;
        this.logger.error(
          GenerateLoggingErrorMessage(
            'Failed to get match questions for category from DB',
            err,
            errMessage.code,
          ),
        );

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errMessage);
      });
  }

  @Get('categories/questions')
  async getAllByCategories(
    @Query('categories') categories: string,
    @Res() res: Response,
  ) {
    // Decode URL query and map to an array
    const ids = decodeURIComponent(categories)?.split(',')?.map(Number);
    if (!ids || ids.length === 0) {
      const errMessage = MATCH_QUESTIONS_GET_BY_CATEGORY_INVALID_IDS_ERROR;
      this.logger.error(
        GenerateLoggingErrorMessage(
          `Failed to get questions for all categories passed: ${categories}`,
          errMessage,
        ),
      );

      return res.status(HttpStatus.BAD_REQUEST).json(errMessage);
    }

    await this.repo
      .getByCategoryIds(...ids)
      .then((questions) => {
        return res
          .status(questions ? HttpStatus.OK : HttpStatus.NOT_FOUND)
          .json(questions);
      })
      .catch((err) => {
        const errMessage = MATCH_QUESTIONS_GET_BY_SUBCATEGORY_DB_ERROR;
        this.logger.error(
          GenerateLoggingErrorMessage(
            'Failed to get match questions from DB',
            err,
            errMessage.code,
          ),
        );

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errMessage);
      });
  }

  @Post('questions')
  async create(@Body() createQuestion: CreateQuestion, @Res() res: Response) {
    await this.repo
      .create(createQuestion)
      .then((history) => {
        return res
          .status(history ? HttpStatus.CREATED : HttpStatus.BAD_GATEWAY)
          .json(history);
      })
      .catch((err) => {
        const errMessage = this.service.getCreateQuestionError(err);
        let code = HttpStatus.INTERNAL_SERVER_ERROR;

        if (errMessage.code !== MATCH_QUESTIONS_CREATE_DB_ERROR.code) {
          code = HttpStatus.CONFLICT;
        }

        this.logger.error(
          GenerateLoggingErrorMessage(
            'Failed to create match question in DB',
            err,
            errMessage.code,
          ),
        );

        return res.status(code).json(errMessage);
      });
  }

  @Delete('questions/:questionId')
  async delete(@Param('questionId') questionId: number, @Res() res: Response) {
    await this.repo
      .delete(questionId)
      .then((deleted) => {
        return res
          .status(deleted ? HttpStatus.OK : HttpStatus.NOT_FOUND)
          .json();
      })
      .catch((err) => {
        const errMessage = MATCH_QUESTION_DELETE_DB_ERROR;

        this.logger.error(
          GenerateLoggingErrorMessage(
            'Failed to delete match question in DB',
            err,
            errMessage.code,
          ),
        );

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errMessage);
      });
  }
}
