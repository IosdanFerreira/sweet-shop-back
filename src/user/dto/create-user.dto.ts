import {
  Equals,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'first_name deve ser do tipo string' })
  @Matches(/^[A-Z][a-zA-Z]{2,}$/, {
    message: 'Nome deve conter pelo menos 2 caracteres',
  })
  first_name: string;

  @IsNotEmpty({ message: 'Sobrenome é obrigatório' })
  @IsString({ message: 'last_name deve ser do tipo string' })
  @Matches(/^[A-Z][a-zA-Z]{2,}$/, {
    message: 'Sobrenome deve conter pelo menos 2 caracteres',
  })
  last_name: string;

  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsString({ message: 'email deve ser do tipo string' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatório' })
  @IsString({ message: 'password deve ser do tipo string' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'A senha deve conter ao menos 8 caracteres, uma letra maiúscula, um número e um carácter especial',
  })
  password: string;

  @IsNotEmpty({ message: 'Senha é obrigatório' })
  @IsString({ message: 'phone deve ser do tipo string' })
  @Matches(/^\(\d{2}\) \d{5}-\d{4}$/, { message: 'Telefone inválido' })
  phone: string;

  @IsNotEmpty({ message: 'Aceitar os termos de privacidade é obrigatório' })
  @IsBoolean({ message: 'phone privacy_consent ser do tipo boolean' })
  @Equals(true, { message: 'Aceitar os termos de privacidade é obrigatório' })
  privacy_consent: boolean;

  @IsNumber({}, { message: 'role_id deve ser um string' })
  @IsNotEmpty({ message: 'O tipo de usuário deve ser informado' })
  role_id: number;
}
