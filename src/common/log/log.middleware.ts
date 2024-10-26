import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class LogMiddleware implements NestMiddleware<Request, Response> {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {}
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;

    this.logger.debug(`Request: ${method} ${originalUrl}`);

    res.on('finish', () => {
      this.logger.debug(`Response: ${res.statusCode} ${originalUrl}`);
    });

    next();
  }
}
