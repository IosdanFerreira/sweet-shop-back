import { UserOutput } from './user-output.interface';

export interface UserOutputWithToken extends UserOutput {
  accessToken: string;
  refreshToken: string;
}
