import { JwtService } from '@nestjs/jwt';
import { IUserPayload } from '../../shared/auth/interfaces/user-payload.interface';
import {
  generateTokensInterface,
  tokensOutput,
} from './interfaces/generate-user-tokens.interface';
import { ConfigType } from '@nestjs/config';
import jwtRefreshConfig from 'src/shared/config/jwt-refresh.config';
import { IUser } from '../interfaces/user.interface';

export class generateTokens implements generateTokensInterface {
  constructor(
    private readonly jwtService: JwtService,

    private refreshTokenConfig: ConfigType<typeof jwtRefreshConfig>,
  ) {}

  generate(user: IUser): tokensOutput {
    const payload: IUserPayload = {
      sub: user.id,
      email: user.email,
      name: user.first_name,
    };

    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(
      payload,
      this.refreshTokenConfig,
    );

    const token: tokensOutput = {
      access_token,
      refresh_token,
    };

    return token;
  }
}
