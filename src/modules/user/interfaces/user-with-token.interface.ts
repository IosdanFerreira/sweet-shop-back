import {
  ITokenOutputProps,
  tokensOutput,
} from './generate-user-tokens.interface';
import { User } from '../entities/user.entity';

export class UserWithToken extends User implements tokensOutput {
  auth_tokens: {
    access_token: ITokenOutputProps;
    refresh_token: ITokenOutputProps;
  };
}
