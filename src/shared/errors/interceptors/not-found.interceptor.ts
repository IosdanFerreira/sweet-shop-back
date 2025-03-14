import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';

import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';
import { NotFoundError } from '../types/not-found.error';
import { catchError } from 'rxjs/operators';

@Injectable()
export class NotFoundInterceptor implements NestInterceptor<IDefaultResponse<null>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IDefaultResponse<null>> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof NotFoundError) {
          const ctx = context.switchToHttp();
          const response = ctx.getResponse();
          const status = HttpStatus.NOT_FOUND;

          const formattedErrors = error.errors;

          const result: IDefaultResponse<null> = {
            status_code: status,
            success: false,
            error_type: 'Not Found',
            errors: formattedErrors,
            message: 'Dado não encontrado',
            data: null,
            pagination: null,
          };

          response.status(status).json(result);
        }

        // Se não for um NotFoundError, propague o erro para outros handlers
        return throwError(() => error);
      }),
    );
  }
}
