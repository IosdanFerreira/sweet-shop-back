import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ThrottlerException } from '@nestjs/throttler';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  /**
   * This method is used to catch and handle the ThrottlerException exception.
   * It formats the response in the standard format and returns the response
   * with the appropriate HTTP status code.
   *
   * @param exception The ThrottlerException exception.
   * @param host The ArgumentsHost object.
   */
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    /**
     * This is the custom response that is returned when the ThrottlerException
     * is caught.
     */
    const customResponse = {
      status_code: HttpStatus.TOO_MANY_REQUESTS,
      success: false,
      error_type: 'Too Many Requests',
      errors: null,
      message: 'Você ultrapassou o limite de requisições. Tente novamente em alguns instantes',
      data: null,
      pagination: null,
    };

    /**
     * This line of code sets the HTTP status code of the response to 429
     * (Too Many Requests) and returns the custom response.
     */
    response.status(HttpStatus.TOO_MANY_REQUESTS).json(customResponse);
  }
}
