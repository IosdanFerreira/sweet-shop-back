import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';

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

  @IsString({ message: 'address deve ser do tipo string' })
  @IsOptional()
  address: string;
}
