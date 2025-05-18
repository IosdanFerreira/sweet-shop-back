import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/shared/decorators/is-public.decorator';
import { UnauthorizedError } from 'src/shared/errors/types/unauthorized.error';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * @description
   * This method is responsible for validating the JWT token used in the request.
   * If the token is invalid or expired, it throws an UnauthorizedError.
   * @param context The execution context of the request.
   * @returns A boolean indicating whether the request is valid or not.
   */
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    /**
     * If the route is marked with the @IsPublic decorator, it doesn't need to be
     * authenticated, so we just return true.
     */
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    /**
     * If the route is not public, we need to validate the JWT token.
     */
    const canActivate = super.canActivate(context);

    /**
     * If the validation is successful, we just return the result.
     */
    if (typeof canActivate === 'boolean') {
      return canActivate;
    }

    /**
     * If the validation fails, we catch the error and throw an UnauthorizedError.
     */
    const canActivatePromise = canActivate as Promise<boolean>;

    return canActivatePromise.catch(() => {
      throw new UnauthorizedError('Token expirado ou inválido', [
        { property: 'token', message: 'Acesso não autorizado' },
      ]);
    });
  }
}
