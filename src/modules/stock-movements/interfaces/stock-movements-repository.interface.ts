import { CreateStockMovementDto } from '../dto/create-stock-movement.dto';
import { StockMovement } from '../entities/stock-movement.entity';

export interface StockMovementsRepositoryInterface {
  registerEntry(stockMovementDTO: CreateStockMovementDto): Promise<StockMovement>;
  registerExit(stockMovementDTO: CreateStockMovementDto): Promise<StockMovement>;
  getMovements(page: number, limit: number, orderBy: 'asc' | 'desc'): Promise<StockMovement[]>;
  countAll(): Promise<number>;
}
