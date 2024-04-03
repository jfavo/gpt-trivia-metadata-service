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
import { UserRepo } from './users.repo';
import { User } from './dto/user.dto';
import { LoginUser } from './dto/loginUser.dto';
import { Logger } from '../../../common/logger/logger.service';
import { Response } from 'express';
import {
  CREATE_USER_DB_ERROR,
  GET_USERS_DB_ERROR,
  GET_USER_BY_ID_DB_ERROR,
  GET_USER_BY_ID_ERROR,
  LOGIN_USER_NOT_FOUND_ERROR,
  LOGIN_USER_DB_ERROR,
  DELETE_USER_DB_ERROR,
  UPDATE_USER_NOT_FOUND_ERROR,
  UPDATE_USER_DB_ERROR,
} from './users.errors';
import {
  hashPassword,
  comparePassword,
} from '../../../common/auth/password/password';
import { GenerateLoggingErrorMessage } from '../../../common/errors/error.utils';
import { MapClientUserFromUser } from './dto/clientUser.dto';
import { ErrorMessage } from '../../../common/errors/error.message';

@Controller('users')
export class UserController {
  constructor(
    private userRepo: UserRepo,
    private logger: Logger,
  ) {
    logger.setContext('UserController');
  }

  @Get(':id')
  async get(@Param() params: any, @Res() res: Response) {
    await this.userRepo
      .getById(params.id)
      .then((user) => {
        if (!user) {
          return res.status(HttpStatus.NOT_FOUND).json(GET_USER_BY_ID_ERROR);
        }
        return res.status(HttpStatus.OK).json(user);
      })
      .catch((err: Error) => {
        this.logger.error(
          GenerateLoggingErrorMessage(`Failed to get user from DB`, err),
        );
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json(GET_USER_BY_ID_DB_ERROR);
      });
  }

  @Get()
  async getAll(@Res() res: Response) {
    await this.userRepo
      .getAll()
      .then((users) => {
        if (!users || users.length === 0) {
          return res.status(HttpStatus.OK).json([]);
        }
        return res.status(HttpStatus.OK).json(users);
      })
      .catch((err) => {
        this.logger.error(
          GenerateLoggingErrorMessage('Failed to get users from DB.', err),
        );
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json(GET_USERS_DB_ERROR);
      });
  }

  @Post('/login')
  async login(@Body() loginUser: LoginUser, @Res() res: Response) {
    await this.userRepo
      .login(loginUser)
      .then(async (user) => {
        if (!user) {
          return res
            .status(HttpStatus.NOT_FOUND)
            .json(LOGIN_USER_NOT_FOUND_ERROR);
        }

        if (await comparePassword(loginUser.password, user.password)) {
          return res.status(HttpStatus.OK).json(MapClientUserFromUser(user));
        } else {
          return res.status(HttpStatus.UNAUTHORIZED).json({});
        }
      })
      .catch((err) => {
        this.logger.error(
          GenerateLoggingErrorMessage(
            'UsersController Failed to fetch user for login.',
            err,
          ),
        );
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(LOGIN_USER_DB_ERROR);
      });
  }

  @Post()
  async create(@Body() createUser: User, @Res() res: Response) {
    const hashedPassword = await hashPassword(createUser.password);
    createUser.password = hashedPassword;

    await this.userRepo
      .create(createUser)
      .then((user) => {
        return res.status(HttpStatus.CREATED).json(user);
      })
      .catch((err) => {
        let code = HttpStatus.INTERNAL_SERVER_ERROR;
        let returnedErr = err;

        // Check for duplicate username/email to give a clearer error response
        if (err instanceof ErrorMessage) {
          code = HttpStatus.CONFLICT;
        } else {
          returnedErr = CREATE_USER_DB_ERROR;
        }

        this.logger.error(
          GenerateLoggingErrorMessage('Failed to create user in DB', err),
        );
        return res.status(code).json(returnedErr);
      });
  }

  @Put()
  async update(@Body() updateUser: User, @Res() res: Response) {
    await this.userRepo
      .update(updateUser)
      .then((user) => {
        if (!user) {
          return res
            .status(HttpStatus.NOT_FOUND)
            .json(UPDATE_USER_NOT_FOUND_ERROR);
        }
        return res.status(HttpStatus.OK).json(user);
      })
      .catch((err) => {
        let code = HttpStatus.INTERNAL_SERVER_ERROR;
        let returnedErr = err;

        // Check for duplicate username/email to give a clearer error response
        if (err instanceof ErrorMessage) {
          code = HttpStatus.CONFLICT;
        } else {
          returnedErr = UPDATE_USER_DB_ERROR;
        }

        this.logger.error(
          GenerateLoggingErrorMessage('Failed to update user in DB', err),
        );
        return res.status(code).json(returnedErr);
      });
  }

  @Delete(':id')
  async delete(@Param() params: any, @Res() res: Response) {
    await this.userRepo
      .delete(params.id)
      .then((user) => {
        if (!user) {
          return res.status(HttpStatus.NOT_FOUND).json(undefined);
        }

        return res.status(HttpStatus.OK).json({ id: user.id });
      })
      .catch((err) => {
        const errMessage = DELETE_USER_DB_ERROR;
        this.logger.error(
          GenerateLoggingErrorMessage(
            'Failed to remove user from DB',
            err,
            errMessage.code,
          ),
        );
        console.log(errMessage);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errMessage);
      });
  }
}
