import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateStockMovementDto {
  @ApiProperty({
    example: 1,
    description: 'ID do produto',
    required: true
  })
  @IsNotEmpty({ message: 'ID do Produto é obrigatório' })
  @IsNumber({}, { message: 'product_id deve ser do tipo number' })
  product_id: number;

  @ApiProperty({
    example: 10,
    description: 'Quantidade a ser movimentada',
    required: true,
    minimum: 1
  })
  @IsNotEmpty({ message: 'Quantidade a ser armazenada é obrigatório' })
  @IsNumber({}, { message: 'quantity deve ser do tipo number' })
  @Min(1, { message: 'Quantidade deve ser maior que 0' })
  quantity: number;
}
