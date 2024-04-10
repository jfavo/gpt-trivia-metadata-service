import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { Match } from './dto/match.dto';
import { CreateMatch } from './dto/create-match.dto';
import { randomUUID } from 'crypto';
import { UpdateMatch } from './dto/update-match.dto';

@Injectable()
export class MatchesRepo {
  constructor(private readonly database: DatabaseService) {}

  async getAllMatches(): Promise<Match[]> {
    try {
      const matches = await this.database.PostgresClient<Match[]>`
        SELECT * FROM matches
      `;

      return Promise.resolve(matches);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getMatchById(id: string): Promise<Match | undefined> {
    try {
      const [match]: [Match?] = await this.database.PostgresClient`
        SELECT * FROM matches WHERE id = ${id}
      `;

      return Promise.resolve(match);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async create(createMatch: CreateMatch): Promise<Match | undefined> {
    try {
      createMatch.id = randomUUID();
      const [match]: [Match?] = await this.database.PostgresClient`
        INSERT INTO matches (id, match_data) VALUES (${createMatch.id}, ${createMatch.matchData}) RETURNING *
      `;

      return Promise.resolve(match);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async update(updatedMatch: UpdateMatch): Promise<Match | undefined> {
    try {
      const [match]: [Match?] = await this.database.PostgresClient`
        UPDATE matches
        SET
          started_at = ${updatedMatch.startedAt},
          finished_at = ${updatedMatch.finishedAt},
          match_data = ${updatedMatch.matchData}
        WHERE id = ${updatedMatch.id}
        RETURNING *
      `;

      return Promise.resolve(match);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const res = await this.database.PostgresClient`
        DELETE FROM matches WHERE id = ${id}
      `;

      return Promise.resolve(res && res.length > 0);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
