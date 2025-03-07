import { ITokenOutputProps, TokensOutputInterface } from './generate-user-tokens.interface';
import { UserEntity } from '../entities/user.entity';

export class UserWithToken extends UserEntity implements TokensOutputInterface {
  auth_tokens: {
    access_token: ITokenOutputProps;
    refresh_token: ITokenOutputProps;
  };
}
