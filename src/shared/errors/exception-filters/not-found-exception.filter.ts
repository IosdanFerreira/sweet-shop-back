import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';

import { Response } from 'express';
import { NotFoundError } from '../types/not-found.error';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';

@Catch(NotFoundError)
export class NotFoundExceptionFilter implements ExceptionFilter {
  /**
   * Handle the NotFoundError exception.
   *
   * This method is used to catch and handle the NotFoundError exception.
   * It formats the response in the standard format and returns the response
   * with the appropriate HTTP status code.
   *
   * @param exception The NotFoundError exception.
   * @param host The ArgumentsHost object.
   */
  catch(exception: NotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Check if the exception is a NotFoundError
    if (exception instanceof NotFoundError) {
      const formattedResponse: IDefaultResponse<null> = {
        status_code: HttpStatus.NOT_FOUND,
        success: false,
        error_type: 'Not Found',
        errors: exception.errors,
        message: exception.message,
        data: null,
        pagination: null,
      };

      // Return the response with the appropriate HTTP status code
      return response.status(HttpStatus.NOT_FOUND).json(formattedResponse);
    }
  }
}
