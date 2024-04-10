import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { MatchQuestion } from './dto/match-question.dto';
import { BulkQuestions } from './dto/bulk-match-questions.dto';
import { MatchQuestionsService } from './match-questions.service';

@Injectable()
export class MatchQuestionsRepo {
  constructor(
    private readonly database: DatabaseService,
    private readonly service: MatchQuestionsService,
  ) {}

  async getBySubcategoryId(subcategoryId: number): Promise<MatchQuestion[]> {
    try {
      const questions = await this.database.PostgresClient<MatchQuestion[]>`
        SELECT * FROM match_questions WHERE subcategory_id = ${subcategoryId}
      `;

      return Promise.resolve(questions);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getByCategoryIds(...categoryIds: number[]): Promise<BulkQuestions[]> {
    try {
      const validIds = categoryIds?.filter((id) => !Number.isNaN(id));
      const res = await this.database.PostgresClient`
        SELECT 
          c.id as category_id,
          c.name as category,
          s.id as subcategory_id,
          s.name as subcategory,
          q.id as question_id,
          q.question,
          q.answer,
          q.choice_1,
          q.choice_2,
          q.choice_3,
          q.choice_4
        FROM match_categories c
        JOIN match_subcategories s ON ${
          validIds.length > 0
            ? this.database
                .PostgresClient`s.category_id IN ${this.database.PostgresClient(validIds)}`
            : this.database.PostgresClient`s.category_id = c.id`
        }
        JOIN match_questions q ON q.subcategory_id = s.id
        ${
          validIds.length > 0
            ? this.database
                .PostgresClient`WHERE c.id IN ${this.database.PostgresClient(validIds)}`
            : this.database.PostgresClient``
        }
      `;

      const bulkAnswers = this.service.mapToBulkQuestions(res);

      return Promise.resolve(bulkAnswers);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async create(
    matchQuestion: MatchQuestion,
  ): Promise<MatchQuestion | undefined> {
    try {
      const [question]: [MatchQuestion?] = await this.database.PostgresClient`
        INSERT INTO match_questions (subcategory_id, question, answer, choice_1, choice_2, choice_3, choice_4) 
        VALUES (${matchQuestion.subcategoryId},
          ${matchQuestion.question},
          ${matchQuestion.answer},
          ${matchQuestion.choice1},
          ${matchQuestion.choice2},
          ${matchQuestion.choice3},
          ${matchQuestion.choice4}) 
        RETURNING *
      `;

      return Promise.resolve(question);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async delete(questionId: number): Promise<boolean> {
    try {
      const res = await this.database.PostgresClient`
        DELETE FROM match_questions
        WHERE id = ${questionId}
        RETURNING *
      `;

      return Promise.resolve(res && res.length > 0);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
