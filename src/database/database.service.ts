import { Injectable } from '@nestjs/common';
import { DBConfig } from '../config/database/database.config';
import postgres, { Sql } from 'postgres';

@Injectable()
export class DatabaseService {
  public readonly PostgresClient: Sql;

  constructor() {
    const connectionString = `
      postgres://${DBConfig.username}:${DBConfig.password}@${DBConfig.host}:${DBConfig.port}/${DBConfig.database}
    `;
    this.PostgresClient = postgres(connectionString, {
      host: DBConfig.host,
      port: DBConfig.port,
      database: DBConfig.database,
      username: DBConfig.username,
      password: DBConfig.password,
      max: DBConfig.maxConnections,
      max_lifetime: DBConfig.maxConnectionLifetime,
      idle_timeout: DBConfig.idleTimeout,
      transform: postgres.toCamel,
    });
  }
}
