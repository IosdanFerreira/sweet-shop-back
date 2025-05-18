import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from '@nestjs/common';

import { Response } from 'express';
import { NotFoundError } from '../types/not-found.error';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';

@Catch(NotFoundError)
export class NotFoundExceptionFilter implements ExceptionFilter {
    catch(exception: NotFoundError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

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

            return response.status(HttpStatus.NOT_FOUND).json(formattedResponse);
        }
    }
}