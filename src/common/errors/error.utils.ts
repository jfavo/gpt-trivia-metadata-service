import { ErrorMessage } from './error.message';

export function GenerateLoggingErrorMessage(
  message: string,
  error: Error,
  code?: number,
): string {
  if (error instanceof ErrorMessage) {
    return `${message} Error: ${error.message} Code: ${error.code}`;
  }

  return `${message} Error: ${error?.message || error}` + code
    ? ` Code: ${code}`
    : '';
}
