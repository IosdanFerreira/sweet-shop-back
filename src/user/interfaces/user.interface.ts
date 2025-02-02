export class IUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  privacy_consent: boolean;
  created_at: Date;
  updated_at: Date;
}
