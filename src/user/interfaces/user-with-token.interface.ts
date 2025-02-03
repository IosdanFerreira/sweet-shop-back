import {
  ITokenOutputProps,
  tokensOutput,
} from '../utils/interfaces/generate-user-tokens.interface';
import { IUser } from './user.interface';

export class IUserWithToken extends IUser implements tokensOutput {
  auth_tokens: {
    access_token: ITokenOutputProps;
    refresh_token: ITokenOutputProps;
  };
}
