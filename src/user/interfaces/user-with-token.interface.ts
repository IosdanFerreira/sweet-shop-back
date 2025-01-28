import { IUser } from './user.interface';

export interface IUserWithToken extends IUser {
  access_token: string;
  refresh_token: string;
}
