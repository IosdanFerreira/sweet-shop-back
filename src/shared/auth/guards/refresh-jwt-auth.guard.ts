// NestJS
import { ExecutionContext, Injectable } from '@nestjs/common';
// Password
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedError } from 'src/shared/errors/types/unauthorized.error';

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard('refresh-jwt') {
    canActivate(context: ExecutionContext) {
        // Adicione lógica adicional aqui se necessário
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            throw new UnauthorizedError('Token expirado ou inválido', [{ property: 'token', message: 'Acesso não autorizado' }]);

        }
        return user;
    }
}
