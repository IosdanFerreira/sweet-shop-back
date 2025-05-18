import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ThrottlerException } from '@nestjs/throttler';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
    catch(exception: ThrottlerException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        // Você pode customizar a mensagem como quiser
        const customResponse = {
            status_code: HttpStatus.TOO_MANY_REQUESTS,
            success: false,
            error_type: 'Too Many Requests',
            errors: null,
            message: 'Você ultrapassou o limite de requisições. Tente novamente em alguns instantes',
            data: null,
            pagination: null,
        };

        response.status(HttpStatus.TOO_MANY_REQUESTS).json(customResponse);
    }
}
