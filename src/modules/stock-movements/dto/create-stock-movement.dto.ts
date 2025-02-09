import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateStockMovementDto {
  @IsNotEmpty({ message: 'ID do Produto é obrigatório' })
  @IsNumber({}, { message: 'product_id deve ser do tipo number' })
  product_id: number;

  @IsNotEmpty({ message: 'Quantidade a ser armazenada é obrigatório' })
  @IsNumber({}, { message: 'quantity deve ser do tipo number' })
  @Min(1, { message: 'Quantidade deve ser maior que 0' })
  quantity: number;
}
