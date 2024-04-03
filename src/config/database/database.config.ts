import { CastStringUndefinedToNumber } from '../../common/utils/utils';

export const DBConfig = {
  type: process.env.DB_TYPE || 'postgres',
  host: process.env.DB_HOST || 'database',
  port: CastStringUndefinedToNumber(process.env.DB_PORT, 5432),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE_NAME || 'openai-trivia-metadata-db',
  maxConnections: CastStringUndefinedToNumber(
    process.env.DB_MAX_CONNECTIONS,
    100,
  ),
  maxConnectionLifetime: CastStringUndefinedToNumber(
    process.env.DB_MAX_CONNECTION_LIFETIME,
    180,
  ),
  idleTimeout: CastStringUndefinedToNumber(
    process.env.DB_IDLE_CONNECTION_TIMEOUT,
    30,
  ),
};
