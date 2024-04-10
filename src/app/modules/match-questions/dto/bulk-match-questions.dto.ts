import { MatchQuestion } from './match-question.dto';

export class BulkQuestions {
  categoryId: number;
  category: string;
  subcategoryId: number;
  subcategory: string;
  questions: MatchQuestion[];
}
