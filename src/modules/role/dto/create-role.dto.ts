import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Nome da permissão é obrigatório' })
  @IsString({ message: 'role_name deve ser do tipo string' })
  role_name: string;
}
