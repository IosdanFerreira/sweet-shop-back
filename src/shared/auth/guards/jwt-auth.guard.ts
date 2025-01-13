import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core'; // Usado para acessar metadados dos decoradores
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/shared/decorators/is-public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Verifica se a rota ou o método tem o decorador `@IsPublic()`
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Se a rota é pública, permite o acesso sem passar pela autenticação
    if (isPublic) {
      return true;
    }

    // Chama o método `canActivate` da classe pai para validar o JWT
    const canActivate = super.canActivate(context);

    // Se o resultado é boolean (síncrono), retorna diretamente
    if (typeof canActivate === 'boolean') {
      return canActivate;
    }

    // Se o resultado é uma Promise, trata possíveis erros
    const canActivatePromise = canActivate as Promise<boolean>;

    return canActivatePromise.catch((error) => {
      if (error instanceof Error) {
        throw new UnauthorizedException('Acesso não autorizado');
      }

      throw new UnauthorizedException('Acesso não autorizado');
    });
  }
}
