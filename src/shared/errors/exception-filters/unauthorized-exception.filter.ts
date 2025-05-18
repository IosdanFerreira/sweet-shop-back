import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from '@nestjs/common';


import { Response } from 'express';
import { UnauthorizedError } from '../types/unauthorized.error';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';

@Catch(UnauthorizedError)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
    catch(exception: UnauthorizedError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (exception instanceof UnauthorizedError) {
            const formattedResponse: IDefaultResponse<null> = {
                status_code: HttpStatus.UNAUTHORIZED,
                success: false,
                error_type: 'unauthorized',
                errors: exception.errors,
                message: exception.message,
                data: null,
                pagination: null,
            };

            return response.status(HttpStatus.UNAUTHORIZED).json(formattedResponse);
        }
    }
}