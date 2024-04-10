import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { FriendsRepo } from './friends.repo';
import { Logger } from '../../../common/logger/logger.service';
import { Response } from 'express';
import { GenerateLoggingErrorMessage } from '../../../common/errors/error.utils';
import {
  FRIENDS_CREATE_FRIEND_DB_ERROR,
  FRIENDS_CREATE_FRIEND_VALIDATION_ERROR,
  FRIENDS_DELETE_FRIEND_VALIDATION_ERROR,
  FRIENDS_GET_ALL_FRIENDS_DB_ERROR,
} from './friends.errors';
import { Friend } from './dto/friend.dto';
import { FriendsService } from './friends.service';

@Controller({
  path: 'users/:userId/friends',
})
export class FriendsController {
  constructor(
    private readonly friendRepo: FriendsRepo,
    private readonly friendService: FriendsService,
    private readonly logger: Logger,
  ) {
    this.logger.setContext('FriendController');
  }

  @Get()
  async getAllFriends(@Param() params: any, @Res() res: Response) {
    await this.friendRepo
      .getAllForUserId(params.userId)
      .then((friends) => {
        return res.status(HttpStatus.OK).json(friends);
      })
      .catch((err) => {
        const errMessage = FRIENDS_GET_ALL_FRIENDS_DB_ERROR;
        this.logger.error(
          GenerateLoggingErrorMessage(
            'Failed to get friends for user',
            err,
            errMessage.code,
          ),
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errMessage);
      });
  }

  @Post()
  async createFriend(
    @Body() friend: Friend,
    @Param() params: any,
    @Res() res: Response,
  ) {
    // Check if userId in the params matches either of the body ids
    if (params.userId != friend.userId1 && params.userId != friend.userId2) {
      const errMessage = FRIENDS_CREATE_FRIEND_VALIDATION_ERROR(
        'userId param is required to match either of the body input user Ids',
      );
      this.logger.error(
        GenerateLoggingErrorMessage(
          'Failed to create friend in DB',
          errMessage,
        ),
      );
      return res.status(HttpStatus.BAD_REQUEST).json(errMessage);
    }

    await this.friendRepo
      .create(friend)
      .then((created) => {
        return res
          .status(created ? HttpStatus.CREATED : HttpStatus.NOT_FOUND)
          .json();
      })
      .catch((err) => {
        let code;
        const errMessage = this.friendService.handleCreateFriendError(err);

        if (errMessage.code === FRIENDS_CREATE_FRIEND_DB_ERROR.code) {
          code = HttpStatus.INTERNAL_SERVER_ERROR;
        } else {
          code = HttpStatus.CONFLICT;
        }

        this.logger.error(
          GenerateLoggingErrorMessage(
            'Failed to create friend in DB',
            errMessage,
          ),
        );
        return res.status(code).json(errMessage);
      });
  }

  @Delete()
  async deleteFriend(
    @Body() friend: Friend,
    @Param() params: any,
    @Res() res: Response,
  ) {
    // Check if userId in the params matches either of the body ids
    if (params.userId != friend.userId1 && params.userId != friend.userId2) {
      const errMessage = FRIENDS_DELETE_FRIEND_VALIDATION_ERROR(
        'userId param is required to match either of the body input user Ids',
      );
      this.logger.error(
        GenerateLoggingErrorMessage(
          'Failed to delete friend in DB',
          errMessage,
        ),
      );
      return res.status(HttpStatus.BAD_REQUEST).json(errMessage);
    }
    await this.friendRepo
      .delete(friend)
      .then((deleted) => {
        return res
          .status(deleted ? HttpStatus.OK : HttpStatus.NOT_FOUND)
          .json();
      })
      .catch((err) => {
        const errMessage = FRIENDS_CREATE_FRIEND_DB_ERROR;
        this.logger.error(
          GenerateLoggingErrorMessage(
            'Failed to create friend in DB',
            err,
            errMessage.code,
          ),
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errMessage);
      });
  }
}
