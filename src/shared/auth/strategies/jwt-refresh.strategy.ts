import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigType } from '@nestjs/config';
import jwtRefreshConfig from 'src/shared/config/jwt-refresh.config';
import { UserPayload } from 'src/shared/interfaces/user-payload.interface';
import { UserFromJwt } from 'src/shared/interfaces/user-from-jwt.interface';
import { Request } from 'express';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(
    @Inject(jwtRefreshConfig.KEY)
    private readonly refreshJwtConfiguration: ConfigType<typeof jwtRefreshConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.refreshToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: refreshJwtConfiguration.secret,
    });
  }

  async validate(payload: UserPayload): Promise<any> {
    return {
      id: payload.sub,
    };
  }
}
