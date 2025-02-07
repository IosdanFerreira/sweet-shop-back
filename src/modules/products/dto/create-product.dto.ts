import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Nome do produto é obrigatório' })
  @IsString({ message: 'name deve ser do tipo string' })
  name: string;

  @IsOptional()
  @IsString({ message: 'description deve ser do tipo string' })
  description: string | null;

  @IsNotEmpty({ message: 'Preço de compra do produto é obrigatório' })
  @IsNumber({}, { message: 'purchase_price deve ser do tipo number' })
  purchase_price: number;

  @IsNotEmpty({ message: 'Preço de venda do produto é obrigatório' })
  @IsNumber({}, { message: 'selling_price deve ser do tipo number' })
  selling_price: number;

  @IsNotEmpty({
    message: 'Quantidade inicial do produto em estoque é obrigatório',
  })
  @IsNumber({}, { message: 'stock deve ser do tipo number' })
  stock: number;

  @IsNotEmpty({ message: 'Categoria do produto é obrigatório' })
  @IsNumber({}, { message: 'category_id deve ser do tipo number' })
  category_id: number;

  @IsNotEmpty({ message: 'Fornecedor é obrigatório' })
  @IsNumber({}, { message: 'supplier_id deve ser do tipo number' })
  supplier_id: number;
}
