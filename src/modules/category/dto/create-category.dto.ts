import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Nome da categoria é obrigatório' })
  @IsString({ message: 'name deve ser do tipo string' })
  name: string;
}
