import { ProductDataBuilder } from 'src/modules/products/__tests__/testing/product-data-builder';
import { StockMovementEntity } from '../../entities/stock-movement.entity';

/**
 * Builds a `StockMovementEntity` object with the given props.
 * @param {StockMovementEntity} [stockMovement] Optional object with props to build the `StockMovementEntity` with.
 * @returns {StockMovementEntity} The built `StockMovementEntity` with the given props.
 */
export function StockMovementDataBuilder(stockMovement?: StockMovementEntity): StockMovementEntity {
  return {
    /**
     * The id of the stock movement.
     */
    id: stockMovement?.id ?? 1,
    /**
     * The type of the stock movement. Can be either 'increase' or 'decrease'.
     */
    type: stockMovement?.type ?? 'increase',
    /**
     * The quantity of the stock movement.
     */
    quantity: stockMovement?.quantity ?? 10,
    /**
     * The date the stock movement was created at.
     */
    created_at: new Date(),
    /**
     * The date the stock movement was updated at.
     */
    updated_at: new Date(),
    /**
     * The product associated with the stock movement.
     */
    product: ProductDataBuilder(),
  };
}
