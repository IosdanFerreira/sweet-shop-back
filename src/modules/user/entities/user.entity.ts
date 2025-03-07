import { RoleEntity } from 'src/modules/role/entities/role.entity';

export class UserEntity {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  phone: string;
  address?: string;
  privacy_consent: boolean;
  role: RoleEntity;
  deleted?: boolean;
  created_at: Date;
  updated_at: Date;
}
