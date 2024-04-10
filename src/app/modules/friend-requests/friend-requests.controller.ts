import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { FriendRequestsRepo } from './friend-requests.repo';
import { FriendRequestsService, RequestType } from './friend-requests.service';
import { Response } from 'express';
import { Logger } from '../../../common/logger/logger.service';
import {
  FRIEND_REQUESTS_CREATE_REQUEST_DB_ERROR,
  FRIEND_REQUESTS_DELETE_REQUEST_DB_ERROR,
  FRIEND_REQUESTS_GET_ALL_REQUEST_DB_ERROR,
  FRIEND_REQUESTS_UPDATE_REQUEST_DB_ERROR,
  FRIEND_REQUEST_CREATE_REQUEST_VALIDATION_ERROR,
  FRIEND_REQUEST_DELETE_REQUEST_VALIDATION_ERROR,
  FRIEND_REQUEST_UPDATE_REQUEST_VALIDATION_ERROR,
} from './friend-requests.errors';
import { GenerateLoggingErrorMessage } from '../../../common/errors/error.utils';
import { EnumValidationPipe } from '../../../common/validation/validators/enum.validator';
import { FriendRequest } from './dto/friend-request.dto';
import { ErrorMessage } from '../../../common/errors/error.message';

@Controller({
  path: 'users/:userId/friends/requests',
})
export class FriendRequestsController {
  constructor(
    private readonly repo: FriendRequestsRepo,
    private readonly service: FriendRequestsService,
    private readonly logger: Logger,
  ) {
    this.logger.setContext('FriendRequestsController');
  }

  @Get()
  async getFriendRequests(
    @Param('userId') userId: any,
    @Res() res: Response,
    @Query(
      'requestType',
      new EnumValidationPipe(RequestType),
      new DefaultValuePipe(RequestType.All),
    )
    requestType: any,
  ) {
    await this.service
      .getFriendRequests(requestType, userId)
      .then((requests) => {
        return res
          .status(requests ? HttpStatus.OK : HttpStatus.NOT_FOUND)
          .json(requests);
      })
      .catch((err) => {
        const errMessage = FRIEND_REQUESTS_GET_ALL_REQUEST_DB_ERROR;
        this.logger.error(
          GenerateLoggingErrorMessage(
            'Failed to get friend requests',
            err,
            errMessage.code,
          ),
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errMessage);
      });
  }

  @Post()
  async create(
    @Param('userId') userId: any,
    @Body() friendRequest: FriendRequest,
    @Res() res: Response,
  ) {
    if (
      userId != friendRequest.userRequestedId &&
      userId != friendRequest.userRequesterId
    ) {
      const errMessage = FRIEND_REQUEST_CREATE_REQUEST_VALIDATION_ERROR(
        'userId param is required to match either of the body input user Ids',
      );
      this.logger.error(
        GenerateLoggingErrorMessage(
          'Failed to create friend request in DB',
          errMessage,
        ),
      );
      return res.status(HttpStatus.BAD_REQUEST).json(errMessage);
    }
    await this.repo
      .createFriendRequest(friendRequest)
      .then((created) => {
        return res
          .status(created ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST)
          .json();
      })
      .catch((err) => {
        let code = HttpStatus.INTERNAL_SERVER_ERROR;
        let errMessage = FRIEND_REQUESTS_CREATE_REQUEST_DB_ERROR;

        if (err instanceof ErrorMessage) {
          code = HttpStatus.CONFLICT;
          errMessage = err;
        }

        this.logger.error(
          GenerateLoggingErrorMessage(
            'Failed to create friend request',
            err,
            errMessage.code,
          ),
        );
        return res.status(code).json(errMessage);
      });
  }

  @Put()
  async update(
    @Param('userId') userId: any,
    @Body() friendRequest: FriendRequest,
    @Res() res: Response,
  ) {
    if (
      userId != friendRequest.userRequestedId &&
      userId != friendRequest.userRequesterId
    ) {
      const errMessage = FRIEND_REQUEST_UPDATE_REQUEST_VALIDATION_ERROR(
        'userId param is required to match either of the body input user Ids',
      );
      this.logger.error(
        GenerateLoggingErrorMessage(
          'Failed to update friend request in DB',
          errMessage,
        ),
      );
      return res.status(HttpStatus.BAD_REQUEST).json(errMessage);
    }
    await this.repo
      .updateFriendRequest(friendRequest)
      .then((created) => {
        return res
          .status(created ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST)
          .json();
      })
      .catch((err) => {
        const errMessage = FRIEND_REQUESTS_UPDATE_REQUEST_DB_ERROR;
        this.logger.error(
          GenerateLoggingErrorMessage(
            'Failed to update friend request',
            err,
            errMessage.code,
          ),
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errMessage);
      });
  }

  @Delete()
  async delete(
    @Param('userId') userId: any,
    @Body() friendRequest: FriendRequest,
    @Res() res: Response,
  ) {
    if (
      userId != friendRequest.userRequestedId &&
      userId != friendRequest.userRequesterId
    ) {
      const errMessage = FRIEND_REQUEST_DELETE_REQUEST_VALIDATION_ERROR(
        'userId param is required to match either of the body input user Ids',
      );
      this.logger.error(
        GenerateLoggingErrorMessage(
          'Failed to delete friend request in DB',
          errMessage,
        ),
      );
      return res.status(HttpStatus.BAD_REQUEST).json(errMessage);
    }
    await this.repo
      .deleteFriendRequest(friendRequest)
      .then((created) => {
        return res
          .status(created ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
          .json();
      })
      .catch((err) => {
        const errMessage = FRIEND_REQUESTS_DELETE_REQUEST_DB_ERROR;
        this.logger.error(
          GenerateLoggingErrorMessage(
            'Failed to delete friend request',
            err,
            errMessage.code,
          ),
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errMessage);
      });
  }
}
