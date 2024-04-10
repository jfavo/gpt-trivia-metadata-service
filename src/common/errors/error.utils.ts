import { ErrorMessage } from './error.message';

export function GenerateLoggingErrorMessage(
  message: string,
  error: Error | ErrorMessage | any,
  code?: number,
): string {
  if (error instanceof ErrorMessage) {
    return `${message} Error: ${error.message} Code: ${error.code}`;
  }

  return (
    `${message} Error: ${getErrorMessage(error)}` +
    (code ? ` Code: ${code}` : '')
  );
}

function getErrorMessage(error: Error | any): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (error instanceof String) {
    return error as string;
  }

  if (error.detail) return error.detail;

  return '';
}

export function IsPostgresUniqueViolation(err: any): boolean {
  return err?.code == 23505;
}

export function IsPostgresForeignKeyViolation(err: any): boolean {
  return err?.code == 23503;
}
