import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';

import { Response } from 'express';
import { BadRequestError } from '../types/bad-request.error';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';

@Catch(BadRequestError)
export class BadRequestExceptionFilter implements ExceptionFilter {
  /**
   * Handle the BadRequestError exception.
   *
   * This method is used to catch and handle the BadRequestError exception.
   * It formats the response in the standard format and returns the response
   * with the appropriate HTTP status code.
   *
   * @param exception The BadRequestError exception.
   * @param host The ArgumentsHost object.
   */
  catch(exception: BadRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Check if the exception is a BadRequestError
    if (exception instanceof BadRequestError) {
      const formattedResponse: IDefaultResponse<null> = {
        status_code: HttpStatus.BAD_REQUEST,
        success: false,
        error_type: 'BadRequest',
        errors: exception.errors,
        message: exception.message,
        data: null,
        pagination: null,
      };

      // Return the response with the appropriate HTTP status code
      return response.status(HttpStatus.BAD_REQUEST).json(formattedResponse);
    }
  }
}
