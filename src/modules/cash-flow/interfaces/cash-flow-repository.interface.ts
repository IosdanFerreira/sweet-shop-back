export interface CashFlowRepositoryInterface {
  findAll(conditionalFilters: any): Promise<any>;
}
