export interface RepositoryContract<T> {
  insert(createDto: any): Promise<void>;
  findAll(
    page: number,
    limit: number,
    orderBy: string,
    search: string,
  ): Promise<T[]>;
  findById(id: number): Promise<T>;
  update(id: number, updateDto: any): Promise<void>;
  remove(id: number): Promise<void>;
}
