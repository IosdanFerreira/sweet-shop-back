import { JwtService } from '@nestjs/jwt';
import { UserPayload } from '../interfaces/user-payload.interface';
import {
  generateTokensInterface,
  tokensOutput,
} from './interfaces/generateUserTokens.interface';
import { ConfigType } from '@nestjs/config';
import jwtRefreshConfig from 'src/shared/config/jwt-refresh.config';
import { UserOutput } from '../interfaces/user-output.interface';

export class generateTokens implements generateTokensInterface {
  constructor(
    private readonly jwtService: JwtService,

    private refreshTokenConfig: ConfigType<typeof jwtRefreshConfig>,
  ) {}

  generate(user: UserOutput): tokensOutput {
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      name: user.first_name,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, this.refreshTokenConfig);

    const token: tokensOutput = {
      accessToken,
      refreshToken,
    };

    return token;
  }
}
