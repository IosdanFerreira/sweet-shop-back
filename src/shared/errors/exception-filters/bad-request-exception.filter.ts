import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from '@nestjs/common';

import { Response } from 'express';
import { BadRequestError } from '../types/bad-request.error';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';

@Catch(BadRequestError)
export class BadRequestExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

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

            return response.status(HttpStatus.BAD_REQUEST).json(formattedResponse);
        }
    }
}