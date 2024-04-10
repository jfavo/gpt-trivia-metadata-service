import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { MatchCategoriesRepo } from './match-categories.repo';
import { Logger } from '../../../common/logger/logger.service';
import { CreateCategory } from './dto/create-category.dto';
import { CreateSubcategory } from './dto/create-subcategory.dto';
import { UpdateCategory } from './dto/update-category.dto';
import { UpdateSubcategory } from './dto/update-subcategory.dto';
import { Response } from 'express';
import {
  CATEGORIES_CREATE_CATEGORY_DB_ERROR,
  CATEGORIES_CREATE_CATEGORY_VALIDATION_ERROR,
  CATEGORIES_CREATE_SUBCATEGORY_DB_ERROR,
  CATEGORIES_CREATE_SUBCATEGORY_VALIDATION_ERROR,
  CATEGORIES_DELETE_CATEGORY_DB_ERROR,
  CATEGORIES_DELETE_SUBCATEGORY_DB_ERROR,
  CATEGORIES_GET_ALL_DB_ERROR,
  CATEGORIES_GET_BY_ID_DB_ERROR,
  CATEGORIES_GET_SUBCATEGORIES_BY_ID_DB_ERROR,
  CATEGORIES_UPDATE_CATEGORY_DB_ERROR,
  CATEGORIES_UPDATE_CATEGORY_VALIDATION_ERROR,
  CATEGORIES_UPDATE_SUBCATEGORY_DB_ERROR,
  CATEGORIES_UPDATE_SUBCATEGORY_VALIDATION_ERROR,
} from './match-categories.errors';
import {
  GenerateLoggingErrorMessage,
  IsPostgresForeignKeyViolation,
  IsPostgresUniqueViolation,
} from '../../../common/errors/error.utils';

@Controller('categories')
export class MatchCategoriesController {
  constructor(
    private readonly repo: MatchCategoriesRepo,
    private readonly logger: Logger,
  ) {}

  @Get()
  async getAll(
    @Query('getSubcategories') getSubcategories: boolean,
    @Query('user') user: number,
    @Res() res: Response,
  ) {
    await this.repo
      .getAll(getSubcategories, user)
      .then((categories) => {
        return res.status(HttpStatus.OK).json(categories || []);
      })
      .catch((err) => {
        const errMessage = CATEGORIES_GET_ALL_DB_ERROR;
        this.logger.error(
          GenerateLoggingErrorMessage(
            'Failed to get categories from DB',
            err,
            errMessage.code,
          ),
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errMessage);
      });
  }

  @Get(':categoryId')
  async getById(
    @Param('categoryId') categoryId: number,
    @Query('getSubcategories') getSubcategories: boolean,
    @Res() res: Response,
  ) {
    await this.repo
      .getById(categoryId, getSubcategories)
      .then((category) => {
        return res.status(HttpStatus.OK).json(category);
      })
      .catch((err) => {
        const errMessage = CATEGORIES_GET_BY_ID_DB_ERROR;
        this.logger.error(
          GenerateLoggingErrorMessage(
            'Failed to get category from DB',
            err,
            errMessage.code,
          ),
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errMessage);
      });
  }

  @Get(':categoryId/subcategories')
  async getAllSubcategories(
    @Param('categoryId') categoryId: any,
    @Res() res: Response,
  ) {
    await this.repo
      .getSubcateogriesById(categoryId)
      .then((subcategories) => {
        return res.status(HttpStatus.OK).json(subcategories);
      })
      .catch((err) => {
        const errMessage = CATEGORIES_GET_SUBCATEGORIES_BY_ID_DB_ERROR;
        this.logger.error(
          GenerateLoggingErrorMessage(
            'Failed to get subcategories from DB',
            err,
            errMessage.code,
          ),
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errMessage);
      });
  }

  @Post()
  async create(@Body() createCategory: CreateCategory, @Res() res: Response) {
    await this.repo
      .createCategory(createCategory)
      .then((category) => {
        return res
          .status(category ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST)
          .json(category);
      })
      .catch((err) => {
        let errMessage = CATEGORIES_CREATE_CATEGORY_DB_ERROR;

        if (
          IsPostgresUniqueViolation(err) ||
          IsPostgresForeignKeyViolation(err)
        ) {
          errMessage = CATEGORIES_CREATE_CATEGORY_VALIDATION_ERROR(err.detail);
        }

        this.logger.error(
          GenerateLoggingErrorMessage(
            'Failed to create category in DB',
            err,
            errMessage.code,
          ),
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errMessage);
      });
  }

  @Post(':categoryId/subcategories')
  async createSubcategory(
    @Param('categoryId') categoryId: any,
    @Body() createSubcategory: CreateSubcategory,
    @Res() res: Response,
  ) {
    await this.repo
      .createSubcategory(categoryId, createSubcategory)
      .then((subcategory) => {
        return res
          .status(subcategory ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST)
          .json(subcategory);
      })
      .catch((err) => {
        let errMessage = CATEGORIES_CREATE_SUBCATEGORY_DB_ERROR;

        if (
          IsPostgresUniqueViolation(err) ||
          IsPostgresForeignKeyViolation(err)
        ) {
          errMessage = CATEGORIES_CREATE_SUBCATEGORY_VALIDATION_ERROR(
            err.detail,
          );
        }

        this.logger.error(
          GenerateLoggingErrorMessage(
            'Failed to create subcategory in DB',
            err,
            errMessage.code,
          ),
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errMessage);
      });
  }

  @Put()
  async update(@Body() updateCategory: UpdateCategory, @Res() res: Response) {
    await this.repo
      .update(updateCategory)
      .then((category) => {
        return res
          .status(category ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
          .json(category);
      })
      .catch((err) => {
        let errMessage = CATEGORIES_UPDATE_CATEGORY_DB_ERROR;

        if (
          IsPostgresUniqueViolation(err) ||
          IsPostgresForeignKeyViolation(err)
        ) {
          errMessage = CATEGORIES_UPDATE_CATEGORY_VALIDATION_ERROR(err.detail);
        }

        this.logger.error(
          GenerateLoggingErrorMessage(
            'Failed to update category in DB',
            err,
            errMessage.code,
          ),
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errMessage);
      });
  }

  @Put(':categoryId/subcategories')
  async updateSubcategory(
    @Param('categoryId') categoryId: number,
    @Body() updateSubcategory: UpdateSubcategory,
    @Res() res: Response,
  ) {
    if (updateSubcategory.categoryId != categoryId) {
      const errMessage = CATEGORIES_UPDATE_SUBCATEGORY_VALIDATION_ERROR(
        'category id from URL param does not match the body',
      );

      this.logger.error(
        GenerateLoggingErrorMessage(
          'Failed to updated subcategory',
          errMessage,
        ),
      );

      return res.status(HttpStatus.BAD_REQUEST).json(errMessage);
    }

    await this.repo
      .updateSubcategory(categoryId, updateSubcategory)
      .then((category) => {
        return res
          .status(category ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
          .json(category);
      })
      .catch((err) => {
        let errMessage = CATEGORIES_UPDATE_SUBCATEGORY_DB_ERROR;

        if (
          IsPostgresUniqueViolation(err) ||
          IsPostgresForeignKeyViolation(err)
        ) {
          errMessage = CATEGORIES_UPDATE_SUBCATEGORY_VALIDATION_ERROR(
            err.detail,
          );
        }

        this.logger.error(
          GenerateLoggingErrorMessage(
            'Failed to update subcategory in DB',
            err,
            errMessage.code,
          ),
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errMessage);
      });
  }

  @Delete(':categoryId')
  async deleteCategory(
    @Param('categoryId') categoryId: number,
    @Res() res: Response,
  ) {
    await this.repo
      .delete(categoryId)
      .then((deleted) => {
        return res
          .status(deleted ? HttpStatus.OK : HttpStatus.NOT_FOUND)
          .json();
      })
      .catch((err) => {
        const errMessage = CATEGORIES_DELETE_CATEGORY_DB_ERROR;
        this.logger.error(
          GenerateLoggingErrorMessage(
            'Failed to delete category from DB',
            err,
            errMessage.code,
          ),
        );

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errMessage);
      });
  }

  @Delete(':categoryId/subcategories/:subcategoryId')
  async deleteSubcategory(
    @Param('categoryId') categoryId: any,
    @Param('subcategoryId') subcategoryId: any,
    @Res() res: Response,
  ) {
    await this.repo
      .deleteSubcategory(categoryId, subcategoryId)
      .then((deleted) => {
        return res
          .status(deleted ? HttpStatus.OK : HttpStatus.NOT_FOUND)
          .json();
      })
      .catch((err) => {
        const errMessage = CATEGORIES_DELETE_SUBCATEGORY_DB_ERROR;
        this.logger.error(
          GenerateLoggingErrorMessage(
            'Failed to delete category from DB',
            err,
            errMessage.code,
          ),
        );

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errMessage);
      });
  }
}
