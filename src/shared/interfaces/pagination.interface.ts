export interface IPaginationResponse {
  total_items: number;
  limit_per_page: number;
  current_page: number;
  prev_page: number | null;
  next_page: number | null;
  total_pages: number;
}

export interface IPagination {
  generate(
    totalItems: number,
    page: number,
    limit: number,
  ): IPaginationResponse;
}
