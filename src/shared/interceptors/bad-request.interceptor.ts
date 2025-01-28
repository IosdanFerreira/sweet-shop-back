import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BadRequestError } from '../errors/bad-request.error';
import { IDefaultResponse } from '../@types/default-response.interface';

@Injectable()
export class BadRequestInterceptor
  implements NestInterceptor<IDefaultResponse<null>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IDefaultResponse<null>> {
    return next.handle().pipe(
      catchError((error) => {
        // Se for um BadRequestError, trata o erro
        if (error instanceof BadRequestError) {
          const ctx = context.switchToHttp();
          const response = ctx.getResponse();
          const status = HttpStatus.BAD_REQUEST;

          const formattedErrors = error.errors;

          const result: IDefaultResponse<null> = {
            status_code: status,
            success: false,
            error_type: 'Bad Request',
            errors: formattedErrors,
            message: 'Erro na requisição, verifique os dados',
            data: null,
            pagination: null,
          };

          response.status(status).json(result);
        }

        // Se não for um BadRequestError, propague o erro para outros handlers
        return throwError(() => error);
      }),
    );
  }
}
