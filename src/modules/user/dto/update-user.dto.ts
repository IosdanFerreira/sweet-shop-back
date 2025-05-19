import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ 
    example: 'Joaquim', 
    description: 'Primeiro nome do usuário',
    required: false
  })
  @IsString({ message: 'first_name deve ser do tipo string' })
  @Matches(/^[A-Z][a-zA-Z]{2,}$/, {
    message: 'Nome deve começar com letra maiúscula e conter pelo menos 2 caracteres',
  })
  @IsOptional()
  first_name: string;

  @ApiProperty({ 
    example: 'Silva', 
    description: 'Sobrenome do usuário',
    required: false
  })
  @IsString({ message: 'last_name deve ser do tipo string' })
  @Matches(/^[A-Z][a-zA-Z]{2,}$/, {
    message: 'Sobrenome deve começar com letra maiúscula e conter pelo menos 2 caracteres',
  })
  @IsOptional()
  last_name: string;

  @ApiProperty({ 
    example: 'joaquim.silva@example.com', 
    description: 'Email do usuário',
    required: false
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsOptional()
  email: string;

  @ApiProperty({ 
    example: '11911223344', 
    description: 'Telefone do usuário (apenas números)',
    required: false
  })
  @IsString({ message: 'phone deve ser do tipo string' })
  @Matches(/^[0-9]{11}$/, { message: 'Telefone deve conter exatamente 11 números' })
  @IsOptional()
  phone: string;

  @ApiProperty({ 
    example: 'R. Example, 123, Bairro, Cidade - UF', 
    description: 'Endereço completo do usuário',
    required: false
  })
  @IsString({ message: 'address deve ser do tipo string' })
  @IsOptional()
  address: string;
}
