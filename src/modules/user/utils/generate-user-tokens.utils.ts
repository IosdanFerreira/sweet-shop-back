import { JwtService } from '@nestjs/jwt';
import { UserPayload } from 'src/shared/interfaces/user-payload.interface';
import {
  generateTokensInterface,
  tokensOutput,
} from '../interfaces/generate-user-tokens.interface';
import { ConfigType } from '@nestjs/config';
import jwtRefreshConfig from 'src/config/jwt-refresh.config';
import { User } from '../entities/user.entity';

export class generateTokens implements generateTokensInterface {
  constructor(
    private readonly jwtService: JwtService,

    private refreshTokenConfig: ConfigType<typeof jwtRefreshConfig>,
  ) {}

  /**
   * Gera os tokens de acesso e refresh_token do usuário.
   *
   * @param user Dados do usuário que se deseja gerar os tokens.
   * @returns Os tokens de acesso e refresh gerados.
   */
  generate(user: User): tokensOutput {
    // Cria a payload do token de acesso
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      name: user.first_name,
    };

    // Gera o token de acesso
    const access_token = this.jwtService.sign(payload);

    // Calcula o tempo de expiração do token de acesso
    const access_token_expires_in =
      new Date().getTime() + Number(process.env.JWT_EXPIRES_IN_SECONDS) * 1000;

    // Gera o token de refresh
    const refresh_token = this.jwtService.sign(
      payload,
      this.refreshTokenConfig,
    );

    // Calcula o tempo de expiração do refresh_token
    const refresh_token_expires_in =
      new Date().getTime() +
      Number(process.env.REFRESH_JWT_EXPIRES_IN_SECONDS) * 1000;

    // Cria o objeto que ser retornado
    const token: tokensOutput = {
      auth_tokens: {
        access_token: {
          token: access_token,
          expires_in: access_token_expires_in,
        },
        refresh_token: {
          token: refresh_token,
          expires_in: refresh_token_expires_in,
        },
      },
    };

    return token;
  }
}
