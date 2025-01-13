import { User } from 'src/user/entities/user.entity';

export interface tokensOutput {
  accessToken: string;
  refreshToken: string;
}

export interface generateTokensInterface {
  generate(user: User): tokensOutput;
}
