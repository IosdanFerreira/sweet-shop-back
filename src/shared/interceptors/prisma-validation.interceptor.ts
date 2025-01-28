import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  ValidationPipe,
  BadRequestException,
  ValidationError,
} from '@nestjs/common';
import { catchError } from 'rxjs/operators';
import { IDefaultResponse } from '../@types/default-response.interface';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class PrismaValidationInterceptor
  implements NestInterceptor<IDefaultResponse<null>>
{
  private readonly validationPipe: ValidationPipe;

  constructor() {
    this.validationPipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    try {
      await this.validationPipe.transform(request.body, {
        type: 'body',
        metatype: context.getHandler().arguments[0]?.metatype, // Obtém o DTO associado
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        const formattedErrors = this.formatValidationErrors(
          error.getResponse() as ValidationError[],
        );
        throw new BadRequestException(formattedErrors);
      }
      throw error;
    }

    return next.handle().pipe(
      catchError((err) => {
        // Caso surjam outros erros, podemos processá-los aqui
        return throwError(() => err);
      }),
    );
  }

  private formatValidationErrors(errors: ValidationError[]): any {
    return errors.map((error) => ({
      status_code: HttpStatus.BAD_REQUEST,
      success: false,
      error_type: 'Validation',
      property: error.property,
      message: error.constraints ? Object.values(error.constraints)[0] : null,
      data: null,
      pagination: null,
    }));
  }
}
