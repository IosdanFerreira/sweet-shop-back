import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ 
    example: 'ADMIN', 
    description: 'Nome do papel/permissão',
    required: true
  })
  @IsNotEmpty({ message: 'Nome da permissão é obrigatório' })
  @IsString({ message: 'role_name deve ser do tipo string' })
  name: string;
}
