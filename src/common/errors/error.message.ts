export class ErrorMessage {
  /**
   * Message of the error
   */
  message: string;

  /**
   * Error code of the error
   */
  code: number;

  constructor(code: number, message: string) {
    this.code = code;
    this.message = message;
  }
}

export function IsErrorMessage(val: any): boolean {
  return val instanceof ErrorMessage;
}
