import { Injectable } from '@nestjs/common';
import { ErrorMessage } from '../../../common/errors/error.message';
import {
  IsPostgresForeignKeyViolation,
  IsPostgresUniqueViolation,
} from '../../../common/errors/error.utils';
import {
  MATCH_QUESTIONS_CREATE_DB_ERROR,
  MATCH_QUESTIONS_CREATE_VALIDATION_ERROR,
} from './match-questions.errors';
import postgres, { Row } from 'postgres';
import { BulkQuestions } from './dto/bulk-match-questions.dto';

@Injectable()
export class MatchQuestionsService {
  getCreateQuestionError(err): ErrorMessage {
    if (IsPostgresForeignKeyViolation(err)) {
      return MATCH_QUESTIONS_CREATE_VALIDATION_ERROR(`
        Subcategory does not exist for ID passed
      `);
    }

    if (IsPostgresUniqueViolation(err)) {
      return MATCH_QUESTIONS_CREATE_VALIDATION_ERROR(err.detail);
    }

    return MATCH_QUESTIONS_CREATE_DB_ERROR;
  }

  mapToBulkQuestions(res: postgres.RowList<Row[]>): BulkQuestions[] {
    const bulk = res.map((r) => r as BulkQuestions);
    console.log(bulk);
    return bulk;
  }
}
