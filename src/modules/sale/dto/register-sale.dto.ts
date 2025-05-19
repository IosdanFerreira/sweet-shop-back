import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, Min, ValidateNested } from 'class-validator';

export class SaleItemDto {
  @ApiProperty({
    example: 1,
    description: 'ID do produto',
    required: true
  })
  @IsNumber({}, { message: 'product_id deve ser do tipo number' })
  @IsNotEmpty({ message: 'ID do produto é obrigatório' })
  product_id: number;

  @ApiProperty({
    example: 5,
    description: 'Quantidade do produto',
    required: true,
    minimum: 1
  })
  @IsNumber({}, { message: 'quantity deve ser do tipo number' })
  @IsNotEmpty({ message: 'Quantidade é obrigatória' })
  @Min(1, { message: 'Quantidade deve ser maior que zero' })
  quantity: number;
}

export class RegisterSaleDto {
  @ApiProperty({
    type: [SaleItemDto],
    description: 'Lista de itens da venda',
    required: true
  })
  @IsArray({ message: 'items deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[];
} 