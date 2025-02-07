export interface RepositoryContract<T> {
  insert(createDto: any): Promise<T>;

  findAll(page: number, limit: number, orderBy: 'asc' | 'desc'): Promise<T[]>;

  countAll(): Promise<number>;

  findAllFiltered(
    page: number,
    limit: number,
    orderBy: 'asc' | 'desc',
    search: string,
  ): Promise<T[]>;

  countAllFiltered(search: string): Promise<number>;

  findById(id: number): Promise<T>;

  update(id: number, updateDto: any): Promise<T>;

  remove(id: number): Promise<void>;
}
