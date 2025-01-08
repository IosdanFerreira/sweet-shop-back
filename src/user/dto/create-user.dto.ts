import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser do tipo string' })
  @Matches(/^[A-Z][a-zA-Z]{2,}$/, {
    message: 'Nome deve conter pelo menos 2 caracteres',
  })
  first_name: string;

  @IsNotEmpty({ message: 'Sobrenome é obrigatório' })
  @IsString({ message: 'Sobrenome deve ser do tipo string' })
  @Matches(/^[A-Z][a-zA-Z]{2,}$/, {
    message: 'Sobrenome deve conter pelo menos 2 caracteres',
  })
  last_name: string;

  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsString({ message: 'Email deve ser do tipo string' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatório' })
  @IsString({ message: 'Senha deve ser do tipo string' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'A senha deve conter ao menos 8 caracteres, uma letra maiúscula, um número e um carácter especial',
  })
  password: string;

  @IsNotEmpty({ message: 'Senha é obrigatório' })
  @IsString({ message: 'Telefone deve ser do tipo string' })
  @Matches(/^[0-9]{11}$/, { message: 'Telefone inválido' })
  phone: string;
}
