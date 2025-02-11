import { CreateStockMovementDto } from '../dto/create-stock-movement.dto';
import { StockMovementEntity } from '../entities/stock-movement.entity';

export interface StockMovementsRepositoryInterface {
  registerEntry(stockMovementDTO: CreateStockMovementDto): Promise<StockMovementEntity>;
  registerExit(stockMovementDTO: CreateStockMovementDto): Promise<StockMovementEntity>;
  getMovements(page: number, limit: number, orderBy: 'asc' | 'desc'): Promise<StockMovementEntity[]>;
  countAll(): Promise<number>;
}
