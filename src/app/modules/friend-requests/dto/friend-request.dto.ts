import { IsBoolean, IsNumber } from 'class-validator';

export class FriendRequest {
  /**
   * User that has requested the friend request
   */
  @IsNumber()
  userRequesterId: number;

  /**
   * User that is being requested to become friends
   */
  @IsNumber()
  userRequestedId: number;

  @IsBoolean()
  accepted: boolean;

  @IsBoolean()
  rejected: boolean;

  constructor(userRequesterId: number, userRequestedId: number) {
    this.userRequesterId = userRequesterId;
    this.userRequestedId = userRequestedId;

    this.accepted = false;
    this.rejected = false;
  }
}
