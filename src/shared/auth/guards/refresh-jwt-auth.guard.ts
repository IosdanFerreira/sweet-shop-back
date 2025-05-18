// NestJS
import { ExecutionContext, Injectable } from '@nestjs/common';
// Password
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { UnauthorizedError } from 'src/shared/errors/types/unauthorized.error';

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard('refresh-jwt') {
  /**
   * Verifies if the user is authenticated by checking the refresh token.
   * If the token is invalid or expired, it throws an UnauthorizedError.
   * @param context The execution context of the request.
   * @returns A boolean indicating whether the request is valid or not.
   */
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  /**
   * Handles the request and returns the user if the authentication is successful.
   * If there is an error or the user is not authenticated, it throws an UnauthorizedError.
   * @param err The error returned from the authentication process.
   * @param user The authenticated user.
   * @returns The authenticated user.
   */
  handleRequest(err: any, user: any): any {
    if (err || !user) {
      throw new UnauthorizedError('Token expirado ou inválido', [
        { property: 'token', message: 'Acesso não autorizado' },
      ]);
    }
    return user;
  }
}
