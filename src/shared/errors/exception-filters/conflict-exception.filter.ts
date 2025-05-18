import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';

import { Response } from 'express';
import { ConflictError } from '../types/conflict.error';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';

@Catch(ConflictError)
export class ConflictExceptionFilter implements ExceptionFilter {
  /**
   * Handles the ConflictError exception.
   *
   * This method is used to catch and handle the ConflictError exception.
   * It formats the response in the standard format and returns the response
   * with the appropriate HTTP status code.
   *
   * @param exception The ConflictError exception.
   * @param host The ArgumentsHost object.
   */
  catch(exception: ConflictError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof ConflictError) {
      /**
       * The formatted response object.
       */
      const formattedResponse: IDefaultResponse<null> = {
        status_code: HttpStatus.CONFLICT,
        success: false,
        error_type: 'conflict',
        errors: exception.errors,
        message: exception.message,
        data: null,
        pagination: null,
      };

      /**
       * Returns the response with the appropriate HTTP status code.
       */
      return response.status(HttpStatus.CONFLICT).json(formattedResponse);
    }
  }
}
