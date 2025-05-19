import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/auth/guards/jwt-auth.guard';

@ApiTags('Relatórios')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('sales')
  @ApiOperation({ 
    summary: 'Relatório de vendas', 
    description: 'Retorna um relatório detalhado das vendas' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Relatório de vendas gerado com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Acesso não autorizado - Token JWT inválido ou expirado' 
  })
  getSales() {
    return this.reportService.getSalesReport();
  }

  @Get('top-products')
  @ApiOperation({ 
    summary: 'Produtos mais vendidos', 
    description: 'Retorna um relatório dos produtos mais vendidos' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Relatório de produtos mais vendidos gerado com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Acesso não autorizado - Token JWT inválido ou expirado' 
  })
  getProducts() {
    return this.reportService.getSellingTopProducts();
  }
}
