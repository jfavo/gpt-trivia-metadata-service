import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '../logger/logger.service';
import requestIp from 'request-ip';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const reqStart = Date.now();
    const ip = requestIp.getClientIp(req);

    next();

    res.on('finish', () => {
      const duration = `${Date.now() - reqStart} ms`;

      this.logger.info(
        `User-IP: ${ip} | User-agent: ${req.headers['user-agent']} | StatusCode: ${res.statusCode} | Method: ${req.method} | Path: ${req.originalUrl} | Duration: ${duration}`,
      );
    });
  }
}
