import { CreateUserDto } from '../dto/create-user.dto';
import { UserEntity } from '../entities/user.entity';

export function UserWithNoTokenDataBuilder(userData?: CreateUserDto): UserEntity {
  return {
    id: 1,
    email: userData?.email ?? 'test@example.com',
    password: userData?.password ?? 'hashedPassword',
    first_name: userData?.first_name ?? 'John',
    last_name: userData?.last_name ?? 'Doe',
    phone: userData?.phone ?? '(11) 12345-6789',
    privacy_consent: userData?.privacy_consent ?? true,
    role: {
      id: 1,
      name: 'admin',
      created_at: new Date(),
      updated_at: new Date(),
    },
    created_at: new Date(),
    updated_at: new Date(),
  };
}
