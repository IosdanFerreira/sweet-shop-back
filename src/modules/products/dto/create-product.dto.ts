import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ 
    example: 'Brigadeiro', 
    description: 'Nome do produto',
    required: true
  })
  @IsNotEmpty({ message: 'Nome do produto é obrigatório' })
  @IsString({ message: 'name deve ser do tipo string' })
  name: string;

  @ApiProperty({ 
    example: 'Brigadeiro tradicional de chocolate', 
    description: 'Descrição detalhada do produto',
    required: false,
    nullable: true
  })
  @IsOptional()
  @IsString({ message: 'description deve ser do tipo string' })
  description: string | null;

  @ApiProperty({ 
    example: 1.50, 
    description: 'Preço de compra do produto',
    required: true,
    minimum: 0
  })
  @IsNotEmpty({ message: 'Preço de compra do produto é obrigatório' })
  @IsNumber({}, { message: 'purchase_price deve ser do tipo number' })
  purchase_price: number;

  @ApiProperty({ 
    example: 3.00, 
    description: 'Preço de venda do produto',
    required: true,
    minimum: 0
  })
  @IsNotEmpty({ message: 'Preço de venda do produto é obrigatório' })
  @IsNumber({}, { message: 'selling_price deve ser do tipo number' })
  selling_price: number;

  @ApiProperty({ 
    example: 100, 
    description: 'Quantidade inicial do produto em estoque',
    required: true,
    minimum: 0
  })
  @IsNotEmpty({
    message: 'Quantidade inicial do produto em estoque é obrigatório',
  })
  @IsNumber({}, { message: 'stock deve ser do tipo number' })
  stock: number;

  @ApiProperty({ 
    example: 1, 
    description: 'ID da categoria do produto',
    required: true
  })
  @IsNotEmpty({ message: 'Categoria do produto é obrigatório' })
  @IsNumber({}, { message: 'category_id deve ser do tipo number' })
  category_id: number;

  @ApiProperty({ 
    example: 1, 
    description: 'ID do fornecedor do produto',
    required: true
  })
  @IsNotEmpty({ message: 'Fornecedor é obrigatório' })
  @IsNumber({}, { message: 'supplier_id deve ser do tipo number' })
  supplier_id: number;
}
