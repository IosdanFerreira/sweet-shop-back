import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConflictError } from '../errors/conflict.error';
import { IDefaultResponse } from '../@types/default-response.interface';

@Injectable()
export class ConflictInterceptor
  implements NestInterceptor<IDefaultResponse<null>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IDefaultResponse<null>> {
    return next.handle().pipe(
      catchError((error) => {
        // Se for um ConflictError, trata o erro
        if (error instanceof ConflictError) {
          const ctx = context.switchToHttp();
          const response = ctx.getResponse();
          const status = HttpStatus.CONFLICT;

          const formattedErrors = error.errors;

          const result: IDefaultResponse<null> = {
            status_code: status,
            success: false,
            error_type: 'Conflict',
            errors: formattedErrors,
            message: 'Conflito de dados',
            data: null,
            pagination: null,
          };

          response.status(status).json(result);
        }

        // Se não for um ConflictError, propague o erro para outros handlers
        return throwError(() => error);
      }),
    );
  }
}
