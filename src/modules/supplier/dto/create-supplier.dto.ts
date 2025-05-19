import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty({ 
    example: 'Doces Maria', 
    description: 'Nome do fornecedor',
    required: true
  })
  @IsNotEmpty({ message: 'Nome do fornecedor é obrigatório' })
  @IsString({ message: 'name deve ser do tipo string' })
  name: string;

  @ApiProperty({ 
    example: '11911223344', 
    description: 'Telefone do fornecedor (apenas números)',
    required: true
  })
  @IsNotEmpty({ message: 'Telefone do fornecedor é obrigatório' })
  @IsString({ message: 'phone deve ser do tipo string' })
  @Matches(/^[0-9]{11}$/, { message: 'Telefone deve conter exatamente 11 números' })
  phone: string;

  @ApiProperty({ 
    example: 'maria.doces@example.com', 
    description: 'Email do fornecedor',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'email deve ser do tipo string' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;
}
