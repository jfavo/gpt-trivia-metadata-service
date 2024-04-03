import { Length, IsString, IsEmail, IsNotEmpty } from 'class-validator';
import {
  ContainsDigit,
  ContainsLowerChar,
  ContainsSpecialChar,
  ContainsUpperChar,
} from '../../../../common/validation/validators/password.validator';

export class User {
  id: number;

  @IsString()
  @Length(4, 16)
  username: string;

  @IsEmail()
  email: string;

  /**
   * 1. Must be between 8-20 characters
   * 2. At least 1 uppercase character
   * 3. At least 1 lowercase character
   * 4. At least 1 digit
   * 5. At least one special character
   */
  @IsString()
  @Length(8, 20)
  @ContainsLowerChar({
    message: 'password requires at least 1 lowercase character.',
  })
  @ContainsUpperChar({
    message: 'password requires at least 1 uppercase character.',
  })
  @ContainsDigit({
    message: 'password requires at least 1 numerical digit.',
  })
  @ContainsSpecialChar({
    message: 'password requires at least 1 special character.',
  })
  password: string;

  @IsNotEmpty()
  birthDate: Date;

  @IsString()
  role: string;

  createdAt: Date;
}
