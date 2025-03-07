import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ example: 'joaquim.silva@example.com', description: 'Email do usuário' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsString({ message: 'Email deve ser do tipo string' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ example: 'Abcd12!@', description: 'Senha do usuário' })
  @IsNotEmpty({ message: 'Senha é obrigatório' })
  @IsString({ message: 'Senha deve ser do tipo string' })
  password: string;
}
