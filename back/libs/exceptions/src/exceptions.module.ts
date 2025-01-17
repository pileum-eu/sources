/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { TrackingService } from '@fc/tracking';

import {
  FcExceptionFilter,
  HttpExceptionFilter,
  RpcExceptionFilter,
  UnhandledExceptionFilter,
  ValidationExceptionFilter,
} from './exception-filters';
import { ExceptionsService } from './exceptions.service';

/**
 * Globally load our custom exception filters
 * @see https://docs.nestjs.com/exception-filters
 */
const exceptionFiltersProviders = [
  {
    provide: APP_FILTER,
    useClass: UnhandledExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: RpcExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: FcExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: ValidationExceptionFilter,
  },
];

@Module({})
export class ExceptionsModule {
  static withTracking(trackingModule: any) {
    return {
      module: ExceptionsModule,
      imports: [trackingModule],
      providers: [
        ...exceptionFiltersProviders,
        ExceptionsService,
        TrackingService,
      ],
      exports: [TrackingService],
    };
  }

  static withoutTracking() {
    const provider = {
      provide: TrackingService,
      useValue: null,
    };
    return {
      module: ExceptionsModule,
      providers: [...exceptionFiltersProviders, ExceptionsService, provider],
      exports: [provider],
    };
  }
}
