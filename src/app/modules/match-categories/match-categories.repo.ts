import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { MatchCategory } from './dto/match-category.dto';
import { MatchSubcategory } from './dto/match-subcategory.dto';
import { BulkCategories } from './dto/bulk-categories.dto';
import { UpdateCategory } from './dto/update-category.dto';
import { UpdateSubcategory } from './dto/update-subcategory.dto';
import { CreateCategory } from './dto/create-category.dto';
import { CreateSubcategory } from './dto/create-subcategory.dto';

@Injectable()
export class MatchCategoriesRepo {
  constructor(private readonly database: DatabaseService) {}

  async getById(
    categoryId: number,
    getSubcategories?: boolean,
  ): Promise<MatchCategory | undefined> {
    try {
      const [category]: [MatchCategory?] = await this.database.PostgresClient`
        SELECT * FROM match_categories c
        ${
          getSubcategories
            ? this.database
                .PostgresClient`FULL JOIN match_subcategories s ON s.category_id = ${categoryId}`
            : this.database.PostgresClient``
        }
        WHERE c.id = ${categoryId}
      `;

      return Promise.resolve(category);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getSubcateogriesById(
    subcategoryId: number,
  ): Promise<MatchSubcategory | undefined> {
    try {
      const [subcategory]: [MatchSubcategory?] = await this.database
        .PostgresClient`
        SELECT * FROM match_subcategories WHERE id = ${subcategoryId}
      `;

      return Promise.resolve(subcategory);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getAll(
    getSubcategories?: boolean,
    userId?: number,
  ): Promise<MatchCategory[] | BulkCategories[] | undefined> {
    try {
      const res = await this.database.PostgresClient.begin(async (sql) => {
        const categories = await sql<MatchCategory[]>`
          SELECT * FROM match_categories
          WHERE user_id IS NULL ${
            userId
              ? this.database.PostgresClient`OR user_id = ${userId}`
              : this.database.PostgresClient``
          }
        `;

        if (getSubcategories && categories?.length > 0) {
          const categoryIds = categories.map((c) => c.id);
          const subcategories = await sql<MatchSubcategory[]>`
            SELECT * FROM match_subcategories WHERE category_id IN ${this.database.PostgresClient(categoryIds)}
          `;

          if (subcategories?.length > 0) {
            const bulk = categories.map((c) => {
              const bulkCategory = new BulkCategories();
              bulkCategory.id = c.id;
              bulkCategory.name = c.name;
              bulkCategory.userId = c.userId;
              bulkCategory.subcategories = subcategories.filter(
                (s) => s.categoryId === c.id,
              );

              return bulkCategory;
            });

            return bulk;
          }
        } else {
          return categories;
        }
      });

      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async createCategory(
    createCategory: CreateCategory,
  ): Promise<BulkCategories | undefined> {
    try {
      const newCategory = new BulkCategories();
      await this.database.PostgresClient.begin(async (sql) => {
        const [category]: [MatchCategory?] = await sql`
          INSERT INTO match_categories ${this.database.PostgresClient(createCategory, ['name', 'userId'])}
          RETURNING *
        `;

        if (category) {
          newCategory.id = category?.id;
          newCategory.name = category?.name;

          if (
            createCategory.subcategories &&
            createCategory.subcategories.length > 0
          ) {
            const subcategories = createCategory.subcategories.map((s) => ({
              ...s,
              categoryId: category.id,
            }));
            const retSubcategories = await sql<MatchSubcategory[]>`
              INSERT INTO match_subcategories ${this.database.PostgresClient(subcategories)}
              RETURNING *
            `;

            newCategory.subcategories = retSubcategories;
          }
        }
      });

      return Promise.resolve(newCategory);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async createSubcategory(
    categoryId: number,
    createSubcategory: CreateSubcategory,
  ): Promise<MatchSubcategory | undefined> {
    try {
      const [subcategory]: [MatchSubcategory?] = await this.database
        .PostgresClient`
        INSERT INTO match_subcategories ${this.database.PostgresClient(createSubcategory)}
        RETURNING *
      `;

      return Promise.resolve(subcategory);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async update(updateCategory: UpdateCategory): Promise<MatchCategory> {
    try {
      const [category]: [MatchCategory?] = await this.database.PostgresClient`
        UPDATE match_categories
        SET
          name = ${updateCategory.name}
        WHERE id = ${updateCategory.id}
        RETURNING *
      `;

      return Promise.resolve(category);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async updateSubcategory(
    categoryId: number,
    updateSubcategory: UpdateSubcategory,
  ): Promise<MatchSubcategory> {
    try {
      const [subcategory]: [MatchSubcategory?] = await this.database
        .PostgresClient`
        UPDATE match_subcategories
        SET
          name = ${updateSubcategory.name}
        WHERE id = ${updateSubcategory.id}
        AND category_id = ${categoryId}
        RETURNING *
      `;

      return Promise.resolve(subcategory);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async delete(categoryId: number): Promise<boolean> {
    try {
      const res = await this.database.PostgresClient`
        DELETE FROM match_categories
        WHERE id = ${categoryId}
        RETURNING *
      `;

      return Promise.resolve(res && res.length > 0);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async deleteSubcategory(
    categoryId: number,
    subcategoryId: number,
  ): Promise<boolean> {
    try {
      const res = await this.database.PostgresClient`
        DELETE FROM match_subcategories
        WHERE id = ${subcategoryId}
        AND category_id = ${categoryId}
        RETURNING *
      `;

      return Promise.resolve(res && res.length > 0);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
