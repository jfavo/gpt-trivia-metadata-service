import { Injectable, Scope } from '@nestjs/common';
import pino from 'pino';

@Injectable({ scope: Scope.TRANSIENT })
export class Logger {
  private readonly logger;
  private serviceName: string;

  constructor() {
    this.logger = pino({
      level: 'info',
    });
  }

  setContext(serviceName: string) {
    this.serviceName = serviceName;
  }

  info(text: string) {
    this.logger.info(this._appendServiceName(text));
  }

  warn(text: string) {
    this.logger.warn(this._appendServiceName(text));
  }

  error(text: string) {
    this.logger.error(this._appendServiceName(text));
  }

  private _appendServiceName(text: string): string {
    if (this.serviceName) {
      return `[${this.serviceName}] ${text}`;
    } else {
      return text;
    }
  }
}
