import { IUser } from 'src/user/interfaces/user.interface';

export interface ITokenOutputProps {
  token: string;
  expires_in: number;
}

export interface tokensOutput {
  auth_tokens: {
    access_token: ITokenOutputProps;
    refresh_token: ITokenOutputProps;
  };
}

export interface generateTokensInterface {
  generate(user: IUser): tokensOutput;
}
