import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Joaquim', description: 'Primeiro nome do usuário' })
  @IsString({ message: 'first_name deve ser do tipo string' })
  @Matches(/^[A-Z][a-zA-Z]{2,}$/, {
    message: 'Nome deve conter pelo menos 2 caracteres',
  })
  @IsOptional()
  first_name: string;

  @ApiProperty({ example: 'Silva', description: 'Sobrenome do usuário' })
  @IsString({ message: 'last_name deve ser do tipo string' })
  @Matches(/^[A-Z][a-zA-Z]{2,}$/, {
    message: 'Sobrenome deve conter pelo menos 2 caracteres',
  })
  @IsOptional()
  last_name: string;

  @ApiProperty({ example: 'joaquim.silva@example.com', description: 'Email do usuário' })
  @IsEmail({}, { message: 'Email inválido' })
  @IsOptional()
  email: string;

  @ApiProperty({ example: '(11) 91122-3344', description: 'Telefone do usuário' })
  @IsString({ message: 'phone deve ser do tipo string' })
  @Matches(/^[0-9]{11}$/, { message: 'Telefone inválido' })
  @IsOptional()
  phone: string;

  @ApiProperty({ example: 'R. example, 123, Bairro, Cidade', description: 'Telefone do usuário' })
  @IsString({ message: 'address deve ser do tipo string' })
  @IsOptional()
  address: string;
}
