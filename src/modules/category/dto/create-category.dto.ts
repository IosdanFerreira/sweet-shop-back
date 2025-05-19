import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ 
    example: 'Doces', 
    description: 'Nome da categoria',
    required: true
  })
  @IsNotEmpty({ message: 'Nome da categoria é obrigatório' })
  @IsString({ message: 'name deve ser do tipo string' })
  name: string;
}
