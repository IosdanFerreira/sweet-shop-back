import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';
import { UnauthorizedError } from '../types/unauthorized.error';

@Injectable()
export class UnauthorizedInterceptor
  implements NestInterceptor<IDefaultResponse<null>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IDefaultResponse<null>> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof UnauthorizedError) {
          const ctx = context.switchToHttp();
          const response = ctx.getResponse();
          const status = HttpStatus.UNAUTHORIZED;

          const formattedErrors = error.errors;

          const result: IDefaultResponse<null> = {
            status_code: status,
            success: false,
            error_type: 'Unauthorized',
            errors: formattedErrors,
            message: 'Acesso não autorizado',
            data: null,
            pagination: null,
          };

          response.status(status).json(result);
        }

        // Se não for um UnauthorizedError, propague o erro para outros handlers
        return throwError(() => error);
      }),
    );
  }
}
