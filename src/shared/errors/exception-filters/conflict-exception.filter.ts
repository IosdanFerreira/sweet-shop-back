import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from '@nestjs/common';

import { Response } from 'express';
import { ConflictError } from '../types/conflict.error';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';

@Catch(ConflictError)
export class ConflictExceptionFilter implements ExceptionFilter {
    catch(exception: ConflictError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (exception instanceof ConflictError) {
            const formattedResponse: IDefaultResponse<null> = {
                status_code: HttpStatus.CONFLICT,
                success: false,
                error_type: 'conflict',
                errors: exception.errors,
                message: exception.message,
                data: null,
                pagination: null,
            };

            return response.status(HttpStatus.CONFLICT).json(formattedResponse);
        }
    }
}