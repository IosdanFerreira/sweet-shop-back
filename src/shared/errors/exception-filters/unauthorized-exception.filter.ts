import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';

import { Response } from 'express';
import { UnauthorizedError } from '../types/unauthorized.error';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';

@Catch(UnauthorizedError)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  /**
   * Catch the UnauthorizedError exception.
   *
   * This method is used to catch the UnauthorizedError exception and
   * return a standardized response with the appropriate HTTP status code.
   *
   * @param exception The UnauthorizedError exception.
   * @param host The ArgumentsHost object.
   * @returns The standardized response with the appropriate HTTP status code.
   */
  catch(exception: UnauthorizedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Check if the exception is an instance of UnauthorizedError
    if (exception instanceof UnauthorizedError) {
      // Format the response in the standard format
      const formattedResponse: IDefaultResponse<null> = {
        status_code: HttpStatus.UNAUTHORIZED,
        success: false,
        error_type: 'unauthorized',
        errors: exception.errors,
        message: exception.message,
        data: null,
        pagination: null,
      };

      // Return the response with the appropriate HTTP status code
      return response.status(HttpStatus.UNAUTHORIZED).json(formattedResponse);
    }
  }
}
