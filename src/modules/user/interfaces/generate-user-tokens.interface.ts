import { UserEntity } from '../entities/user.entity';

export interface ITokenOutputProps {
  token: string;
  expires_in: number;
}

export interface TokensOutputInterface {
  auth_tokens: {
    access_token: ITokenOutputProps;
    refresh_token: ITokenOutputProps;
  };
}

export interface GenerateTokensInterface {
  generate(user: UserEntity): TokensOutputInterface;
}
