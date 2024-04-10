import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { User } from './dto/user.dto';
import { ClientUser } from './dto/clientUser.dto';
import { UPDATE_USER_VALIDATION_ERROR } from './users.errors';
import { LoginUser } from './dto/loginUser.dto';
import { ErrorMessage } from 'src/common/errors/error.message';

@Injectable()
export class UsersRepo {
  constructor(private database: DatabaseService) {}

  /**
   * Retrieves all users stored in the records
   * @returns Array of users in the records
   */
  async getAll(): Promise<ClientUser[]> {
    try {
      const users = await this.database.PostgresClient<
        ClientUser[]
      >`SELECT id, username, email, birth_date AS birthDate, role FROM users`;

      return Promise.resolve(users);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Returns the user data for the id supplied
   * @param id Id of the user
   * @returns User if it existed in the records, otherwise undefined
   */
  async getById(id: number): Promise<ClientUser | undefined> {
    try {
      const [user]: [ClientUser?] = await this.database
        .PostgresClient`SELECT id, username, email, birth_date AS birthDate, role FROM users WHERE id = ${id}`;

      return Promise.resolve(user);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Returns the user data for the username of the user
   * @param user User credentials required for the login
   * @returns User data if the username exists. Otherwise undefined
   */
  async login(user: LoginUser): Promise<User | undefined> {
    try {
      const [foundUser]: [User?] = await this.database.PostgresClient`
        SELECT id, username, password, email, role FROM users WHERE LOWER(username) = LOWER(${user.username})
      `;

      return Promise.resolve(foundUser);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Creates a new user record in the records
   * @param newUser User data to be added in the records
   * @returns User data recieved
   */
  async create(newUser: User): Promise<ClientUser> {
    try {
      const [user]: [ClientUser?] = await this.database
        .PostgresClient`INSERT INTO users ${this.database.PostgresClient(
        newUser,
      )} RETURNING id, username, email, birth_date AS birthDate, role`;

      return Promise.resolve(user);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Updates a user record in the records
   * @param newUser User data to be added in the records
   * @returns User data recieved
   */
  async update(updateUser: User): Promise<ClientUser> {
    try {
      const [user]: [ClientUser?] = await this.database.PostgresClient`
        UPDATE users SET 
          username = ${updateUser.username},
          email = ${updateUser.email},
          password = ${updateUser.password},
          birth_date = ${updateUser.birthDate},
          role = ${updateUser.role}
        WHERE id = ${updateUser.id}
        RETURNING id, username, email, birth_date AS birthDate, role`;

      return Promise.resolve(user);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Removes the user from the records
   * @param id Id for the user requesting to be removed
   * @returns Data of the removed user
   */
  async delete(id: number): Promise<ClientUser> {
    try {
      const [user]: [ClientUser?] = await this.database
        .PostgresClient`DELETE FROM users WHERE id = ${id} RETURNING id`;

      return Promise.resolve(user);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  getUniqueError(err: any): ErrorMessage {
    const isUsername = err?.constraint_name.includes('username');
    const errMessage = `Value for ${isUsername ? 'username' : 'email'} already exists for user in the records`;
    return UPDATE_USER_VALIDATION_ERROR(errMessage);
  }
}
