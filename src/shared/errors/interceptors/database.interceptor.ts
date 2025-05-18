import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { DatabaseError } from '../types/database.error';
import { isPrismaError } from '../utils/is-prisma-error.util';
import { handleDatabaseErrors } from '../utils/handle-database-errors.util';
@Injectable()
export class DatabaseInterceptor implements NestInterceptor {
  /**
   * Intercepts incoming requests and handles database-related errors.
   *
   * This method is part of the NestJS interceptor mechanism. It processes
   * the request-response cycle and catches any errors that occur during
   * the handling of the request, particularly focusing on Prisma database
   * errors.
   *
   * @param context The execution context of the request.
   * @param next The call handler for processing the request.
   * @returns An Observable that may throw a transformed error.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        // Check if the error is a known Prisma client error
        if (isPrismaError(error)) {
          // Transform the Prisma error to a more user-friendly format
          error = handleDatabaseErrors(error);
        }
        // If the error is a DatabaseError, throw a BadRequestException
        if (error instanceof DatabaseError) {
          throw new BadRequestException(error.message);
        } else {
          // Re-throw any other type of error
          throw error;
        }
      }),
    );
  }
}
