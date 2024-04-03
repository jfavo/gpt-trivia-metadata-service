import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { User } from './dto/user.dto';
import { ClientUser } from './dto/clientUser.dto';
import { CREATE_USER_VALIDATION_ERROR, UPDATE_USER_VALIDATION_ERROR } from './users.errors';
import { LoginUser } from './dto/loginUser.dto';

@Injectable()
export class UserRepo {
  constructor(private database: DatabaseService) {}

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

  async getById(id: number): Promise<ClientUser | undefined> {
    try {
      const [user]: [ClientUser?] = await this.database
        .PostgresClient`SELECT id, username, email, birth_date AS birthDate, role FROM users WHERE id = ${id}`;

      return Promise.resolve(user);
    } catch (err) {
      return Promise.reject(err);
    }
  }

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

  async create(newUser: User): Promise<ClientUser | any> {
    try {
      const [user]: [ClientUser?] = await this.database
        .PostgresClient`INSERT INTO users ${this.database.PostgresClient(
        newUser,
      )} RETURNING id, username, email, birth_date AS birthDate, role`;

      return Promise.resolve(user);
    } catch (err) {
      return Promise.reject(CREATE_USER_VALIDATION_ERROR(err.message));
    }
  }

  async update(updateUser: User): Promise<ClientUser | undefined> {
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
      return Promise.reject(UPDATE_USER_VALIDATION_ERROR(err.message));
    }
  }

  async delete(id: number): Promise<ClientUser | undefined> {
    try {
      const [user]: [ClientUser?] = await this.database
        .PostgresClient`DELETE FROM users WHERE id = ${id} RETURNING id`;

      return Promise.resolve(user);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
