import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSupplierDto {
  @IsNotEmpty({ message: 'Nome do fornecedor é obrigatório' })
  @IsString({ message: 'name deve ser do tipo string' })
  name: string;

  @IsNotEmpty({ message: 'Telefone do fornecedor é obrigatório' })
  @IsString({ message: 'phone deve ser do tipo string' })
  phone: string;

  @IsOptional()
  @IsString({ message: 'email deve ser do tipo string' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;
}
