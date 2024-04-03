import { IsNotEmpty } from 'class-validator';

export class LoginUser {
  @IsNotEmpty({
    message: 'username is required',
  })
  username: string;

  @IsNotEmpty({
    message: 'password is required',
  })
  password: string;
}
