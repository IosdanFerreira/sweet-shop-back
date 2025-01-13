import { $Enums } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @IsString({ message: 'first_name deve ser do tipo string' })
  @Matches(/^[A-Z][a-zA-Z]{2,}$/, {
    message: 'Nome deve conter pelo menos 2 caracteres',
  })
  @IsOptional()
  first_name: string;

  @IsString({ message: 'last_name deve ser do tipo string' })
  @Matches(/^[A-Z][a-zA-Z]{2,}$/, {
    message: 'Sobrenome deve conter pelo menos 2 caracteres',
  })
  @IsOptional()
  last_name: string;

  @IsString({ message: 'email deve ser do tipo string' })
  @IsEmail({}, { message: 'Email inválido' })
  @IsOptional()
  email: string;

  @IsString({ message: 'phone deve ser do tipo string' })
  @Matches(/^[0-9]{11}$/, { message: 'Telefone inválido' })
  @IsOptional()
  phone: string;

  @IsString({ message: 'birth_date deve ser do tipo string' })
  @Matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
    message: 'Data de nascimento de estar no formato DD/MM/AAAA',
  })
  @IsOptional()
  birth_date: string;

  @IsString({ message: 'gender deve ser do tipo string' })
  @IsOptional()
  gender: $Enums.Gender;

  @IsString({ message: 'address deve ser do tipo string' })
  @IsOptional()
  address: string;

  @IsString({ message: 'occupation deve ser do tipo string' })
  @IsOptional()
  occupation: string;

  @IsString({ message: 'emergency_contact_name deve ser do tipo string' })
  @IsOptional()
  emergency_contact_name: string;

  @IsString({ message: 'emergency_contact_number deve ser do tipo string' })
  @IsOptional()
  emergency_contact_number: string;

  @IsString({ message: 'primary_physician deve ser do tipo string' })
  @IsOptional()
  primary_physician: string;

  @IsString({ message: 'insurance_provider deve ser do tipo string' })
  @IsOptional()
  insurance_provider: string;

  @IsString({ message: 'insurance_policy_number deve ser do tipo string' })
  @IsOptional()
  insurance_policy_number: string;

  @IsString({ message: 'allergies deve ser do tipo string' })
  @IsOptional()
  allergies: string;

  @IsString({ message: 'current_medication deve ser do tipo string' })
  @IsOptional()
  current_medication: string;

  @IsString({ message: 'family_medical_history deve ser do tipo string' })
  @IsOptional()
  family_medical_history: string;

  @IsString({ message: 'past_medical_history deve ser do tipo string' })
  @IsOptional()
  past_medical_history: string;

  @IsString({ message: 'identification_type deve ser do tipo string' })
  @IsOptional()
  identification_type: string;

  @IsString({ message: 'identification_number deve ser do tipo string' })
  @IsOptional()
  identification_number: string;

  @IsString({ message: 'identification_document deve ser do tipo string' })
  @IsOptional()
  identification_document: string;

  @IsOptional()
  @IsBoolean({ message: 'privacy_consent deve ser do tipo boolean' })
  privacy_consent: boolean;
}
