import { Module } from '@nestjs/common';

import { HttpLoggerInterceptor } from '@/common/http-logger.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { Logger } from '@/common/logger';

const httpInterceptor = {
  provide: APP_INTERCEPTOR,
  useClass: HttpLoggerInterceptor,
};

@Module({
  providers: [Logger, httpInterceptor],
  exports: [Logger],
})
export class CommonModule {}
