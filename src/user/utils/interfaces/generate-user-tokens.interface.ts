import { User } from 'src/user/entities/user.entity';

export interface tokensOutput {
  access_token: string;
  refresh_token: string;
}

export interface generateTokensInterface {
  generate(user: User): tokensOutput;
}
