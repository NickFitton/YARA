import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use({ method, originalUrl }: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    this.logger.log(`> ${method} ${originalUrl}`);

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;
      this.logger.log(
        `< ${method} ${originalUrl} ${statusCode} - ${duration}ms`,
      );
    });

    res.on('error', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;
      this.logger.log(
        `< ${method} ${originalUrl} ${statusCode} - ${duration}ms`,
      );
    });

    next();
  }
}
