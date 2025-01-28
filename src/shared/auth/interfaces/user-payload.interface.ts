export interface IUserPayload {
  sub: number;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}
