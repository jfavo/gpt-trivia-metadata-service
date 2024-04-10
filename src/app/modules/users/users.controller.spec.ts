import { UsersController } from './users.controller';
import { Logger } from '../../../common/logger/logger.service';
import { UsersRepo } from './users.repo';
import { DatabaseService } from '../../../database/database.service';
import { spyOn } from 'jest-mock';
import { expect, beforeEach, describe, it } from '@jest/globals';
import { createResponse } from 'node-mocks-http';
import { ClientUser, MapClientUserFromUser } from './dto/clientUser.dto';
import { HttpStatus } from '@nestjs/common';
import {
  CREATE_USER_DB_ERROR,
  CREATE_USER_VALIDATION_ERROR,
  DELETE_USER_DB_ERROR,
  GET_USERS_DB_ERROR,
  GET_USER_BY_ID_DB_ERROR,
  GET_USER_BY_ID_ERROR,
  LOGIN_USER_DB_ERROR,
  LOGIN_USER_NOT_FOUND_ERROR,
  UPDATE_USER_DB_ERROR,
  UPDATE_USER_NOT_FOUND_ERROR,
  UPDATE_USER_VALIDATION_ERROR,
} from './users.errors';
import { ErrorMessage } from '../../../common/errors/error.message';
import { LoginUser } from './dto/loginUser.dto';
import { User } from './dto/user.dto';
import { UsersService } from './users.service';

describe('UserController', () => {
  let userRepo: UsersRepo;
  let userService: UsersService;
  let logger: Logger;
  let userController: UsersController;

  let loggerErrorSpy;

  const testClientUser = {
    username: 'test',
    email: 'test@email.com',
    birthDate: '2000-01-01',
    role: 'standard',
    id: 1,
  } as unknown as ClientUser;

  const testClientUser2 = {
    username: 'test2',
    email: 'test2@email.com',
    birthDate: '2000-01-01',
    role: 'admin',
    id: 2,
  } as unknown as ClientUser;

  const mockDBService = {
    PostgresClient: null,
  } as unknown as DatabaseService;

  beforeEach(() => {
    userRepo = new UsersRepo(mockDBService);
    userService = new UsersService();
    logger = new Logger();
    userController = new UsersController(userRepo, userService, logger);

    loggerErrorSpy = spyOn(logger, 'error').mockImplementation(() => {});
  });

  describe('get', () => {
    type TestTuple = [
      string,
      object,
      ClientUser | undefined,
      ErrorMessage | undefined,
      Error | undefined,
      number,
    ];

    const params = { id: 1 };

    it.each<TestTuple>([
      [
        'should return the user for the id',
        params,
        testClientUser,
        undefined,
        undefined,
        HttpStatus.OK,
      ],
      [
        'should return error message when user does not exist',
        params,
        undefined,
        GET_USER_BY_ID_ERROR,
        undefined,
        HttpStatus.NOT_FOUND,
      ],
      [
        'should return error if DB throws an exception',
        params,
        undefined,
        GET_USER_BY_ID_DB_ERROR,
        new Error('DB error!'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      ],
    ])(
      '%s',
      async (
        _,
        params,
        expected,
        expectedErrorMessage,
        expectedError,
        expectedStatusCode: number,
      ) => {
        const res = createResponse();
        const spy = spyOn(userRepo, 'getById');
        if (expectedError) {
          spy.mockRejectedValue(expectedError);
        } else {
          spy.mockResolvedValue(expected as ClientUser);
        }

        await userController.get(params, res);

        expect(res.statusCode).toEqual(expectedStatusCode);
        expect(res._getJSONData()).toEqual(expectedErrorMessage || expected);

        if (expectedError) {
          expect(loggerErrorSpy).toBeCalled();
        }
      },
    );
  });

  describe('getAll', () => {
    type TestTuple = [
      string,
      ClientUser[] | undefined,
      ErrorMessage | undefined,
      Error | undefined,
      number,
    ];
    it.each<TestTuple>([
      [
        'should return all users',
        [testClientUser, testClientUser2],
        undefined,
        undefined,
        HttpStatus.OK,
      ],
      ['should return empty array', [], undefined, undefined, HttpStatus.OK],
      [
        'should return error if DB throws an exception',
        undefined,
        GET_USERS_DB_ERROR,
        new Error('DB error!'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      ],
    ])(
      '%s',
      async (
        _,
        expected,
        expectedErrorMessage,
        expectedError,
        expectedStatusCode: number,
      ) => {
        const res = createResponse();
        const spy = spyOn(userRepo, 'getAll');
        if (expectedError) {
          spy.mockRejectedValue(expectedError);
        } else {
          spy.mockResolvedValue(expected as ClientUser[]);
        }

        await userController.getAll(res);

        expect(res.statusCode).toEqual(expectedStatusCode);
        expect(res._getJSONData()).toEqual(expectedErrorMessage || expected);

        if (expectedError) {
          expect(loggerErrorSpy).toBeCalled();
        }
      },
    );
  });

  describe('login', () => {
    const testLoginUser = {
      username: 'test',
      password: 'tTt@233',
    } as LoginUser;

    const testUser = {
      ...testClientUser,
      username: testLoginUser.username,
      password: '$2b$10$hsAQ8Ml04OvFpCnEXkupL.lebG07NbYEsmuApxecVPrz5cRGTMIz.',
    } as User;

    type TestTuple = [
      string,
      LoginUser | undefined,
      User | undefined,
      ClientUser | object | undefined,
      ErrorMessage | undefined,
      Error | undefined,
      number,
    ];
    it.each<TestTuple>([
      [
        'should return user for login details',
        testLoginUser,
        testUser,
        MapClientUserFromUser(testUser),
        undefined,
        undefined,
        HttpStatus.OK,
      ],
      [
        'should return error message if user does not exist',
        testLoginUser,
        undefined,
        undefined,
        LOGIN_USER_NOT_FOUND_ERROR,
        undefined,
        HttpStatus.NOT_FOUND,
      ],
      [
        'should return unauthorized if user password is incorrect',
        testLoginUser,
        { ...testUser, password: 'incorrect!' },
        {},
        undefined,
        undefined,
        HttpStatus.UNAUTHORIZED,
      ],
      [
        'should return errorMessage if DB returns an error',
        testLoginUser,
        undefined,
        undefined,
        LOGIN_USER_DB_ERROR,
        new Error('DB error!'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      ],
    ])(
      '%s',
      async (
        _,
        body,
        repoResult,
        expected,
        expectedErrorMessage,
        expectedError,
        expectedStatusCode: number,
      ) => {
        const res = createResponse();
        const spy = spyOn(userRepo, 'login');
        if (expectedError) {
          spy.mockRejectedValue(expectedError);
        } else {
          spy.mockResolvedValue(repoResult);
        }

        await userController.login(body as LoginUser, res);

        expect(res.statusCode).toEqual(expectedStatusCode);
        expect(res._getJSONData()).toEqual(expectedErrorMessage || expected);

        if (expectedError) {
          expect(loggerErrorSpy).toBeCalled();
        }
      },
    );
  });

  describe('create', () => {
    type TestTuple = [
      string,
      User | undefined,
      ClientUser | undefined,
      ErrorMessage | undefined,
      Error | ErrorMessage | undefined,
      number,
    ];

    const validUser = {
      username: 'valid',
      password: 'vA1idP@ssword',
      email: 'valid@email.com',
      birthDate: '2000-01-01',
      role: 'standard',
    } as unknown as User;

    it.each<TestTuple>([
      [
        'should return the user after successfully creating',
        validUser,
        MapClientUserFromUser(validUser),
        undefined,
        undefined,
        HttpStatus.CREATED,
      ],
      [
        'should error for duplicate value',
        validUser,
        undefined,
        CREATE_USER_VALIDATION_ERROR(
          `duplicate key in records for column: users_username_key`,
        ),
        CREATE_USER_VALIDATION_ERROR(
          `duplicate key in records for column: users_username_key`,
        ),
        HttpStatus.CONFLICT,
      ],
      [
        'should return internal server error for DB error',
        validUser,
        undefined,
        CREATE_USER_DB_ERROR,
        new Error('DB error!'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      ],
    ])(
      '%s',
      async (
        _,
        body,
        expected,
        expectedErrorMessage,
        expectedError,
        expectedStatusCode: number,
      ) => {
        const res = createResponse();
        const spy = spyOn(userRepo, 'create');
        if (expectedError) {
          spy.mockRejectedValue(expectedError);
        } else {
          spy.mockResolvedValue(expected as ClientUser);
        }

        await userController.create(body as User, res);

        expect(res.statusCode).toEqual(expectedStatusCode);
        expect(res._getJSONData()).toEqual(expectedErrorMessage || expected);

        if (expectedError) {
          expect(loggerErrorSpy).toBeCalled();
        }
      },
    );
  });

  describe('update', () => {
    type TestTuple = [
      string,
      User | undefined,
      ClientUser | undefined,
      ErrorMessage | undefined,
      Error | ErrorMessage | undefined,
      number,
    ];

    const validUser = {
      id: 1,
      username: 'valid',
      password: 'vA1idP@ssword',
      email: 'valid@email.com',
      birthDate: '2000-01-01',
      role: 'standard',
    } as unknown as User;

    it.each<TestTuple>([
      [
        'should return the user after successfully creating',
        validUser,
        MapClientUserFromUser(validUser),
        undefined,
        undefined,
        HttpStatus.OK,
      ],
      [
        'should return not found error if user does not exist for id',
        validUser,
        undefined,
        UPDATE_USER_NOT_FOUND_ERROR,
        undefined,
        HttpStatus.NOT_FOUND,
      ],
      [
        'should error when the updated user value is duplicate in the DB',
        validUser,
        undefined,
        UPDATE_USER_VALIDATION_ERROR(
          'duplicate key in records: users_username_key',
        ),
        UPDATE_USER_VALIDATION_ERROR(
          'duplicate key in records: users_username_key',
        ),
        HttpStatus.CONFLICT,
      ],
      [
        'should error when DB throws an exception',
        validUser,
        undefined,
        UPDATE_USER_DB_ERROR,
        new Error('DB error!'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      ],
    ])(
      '%s',
      async (
        _,
        body,
        expected,
        expectedErrorMessage,
        expectedError,
        expectedStatusCode: number,
      ) => {
        const res = createResponse();
        const spy = spyOn(userRepo, 'update');
        if (expectedError) {
          spy.mockRejectedValue(expectedError);
        } else {
          spy.mockResolvedValue(expected as ClientUser);
        }

        await userController.update(body as User, res);

        expect(res.statusCode).toEqual(expectedStatusCode);
        expect(res._getJSONData()).toEqual(expectedErrorMessage || expected);

        if (expectedError) {
          expect(loggerErrorSpy).toBeCalled();
        }
      },
    );
  });

  describe('delete', () => {
    type TestTuple = [
      string,
      object,
      object | undefined,
      ErrorMessage | undefined,
      Error | undefined,
      number,
    ];

    const params = { id: 1 };

    it.each<TestTuple>([
      [
        'should return the user id for successfully deleting user',
        params,
        { id: testClientUser.id },
        undefined,
        undefined,
        HttpStatus.OK,
      ],
      [
        'should return nothing when user does not exist',
        params,
        undefined,
        undefined,
        undefined,
        HttpStatus.NOT_FOUND,
      ],
      [
        'should return error if DB throws an exception',
        params,
        undefined,
        DELETE_USER_DB_ERROR,
        new Error('DB error!'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      ],
    ])(
      '%s',
      async (
        _,
        params,
        expected,
        expectedErrorMessage,
        expectedError,
        expectedStatusCode: number,
      ) => {
        const res = createResponse();
        const spy = spyOn(userRepo, 'delete');
        if (expectedError) {
          spy.mockRejectedValue(expectedError);
        } else {
          spy.mockResolvedValue(expected as ClientUser);
        }

        await userController.delete(params, res);

        expect(res.statusCode).toEqual(expectedStatusCode);
        if (expected || expectedErrorMessage) {
          expect(res._getJSONData()).toEqual(expectedErrorMessage || expected);
        }

        if (expectedError) {
          expect(loggerErrorSpy).toBeCalled();
        }
      },
    );
  });
});
