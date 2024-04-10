import { MatchSubcategory } from './match-subcategory.dto';

export class BulkCategories {
  id: number;
  name: string;
  userId: number;
  subcategories: MatchSubcategory[];
}
