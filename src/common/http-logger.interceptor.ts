import { catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  ExecutionContext,
  NestInterceptor,
  HttpException,
  CallHandler,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { CustomLogger, Logger } from '@/common/logger';

@Injectable()
export class HttpLoggerInterceptor implements NestInterceptor {
  private logger: CustomLogger;

  constructor(private readonly ls: Logger) {
    const logLabel = 'HTTP';
    this.logger = this.ls.customLogger(logLabel);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { method, path } = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(() => {
        const { statusCode } = context.switchToHttp().getResponse();
        this.logger.debug(`${method} ${path} (${statusCode})`);
      }),
      catchError((err) => {
        if (err instanceof HttpException) {
          this.logger.debug(`${method} ${path} (${err.getStatus()})`);
          throw err;
        }
        this.logger.warn(`Unhandled error - ${err}`);
        throw new HttpException(
          { message: 'Internal server error' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }
}
