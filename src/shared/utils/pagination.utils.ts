import { PaginationInterface, PaginationResponseInterface } from '../interfaces/pagination.interface';

export class Pagination implements PaginationInterface {
  /**
   * Generate pagination metadata
   * @param totalItems Total number of items in the collection
   * @param page Current page number
   * @param limit Number of items per page
   * @returns Pagination metadata
   */
  generate(totalItems: number, page: number, limit: number): PaginationResponseInterface {
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalItems / limit);

    // Calculate the previous page number
    const prevPage = page > 1 ? page - 1 : null;

    // Calculate the next page number
    const nextPage = page < totalPages ? page + 1 : null;

    // Return the pagination metadata
    return {
      // Total number of items in the collection
      total_items: totalItems,

      // Number of items per page
      limit_per_page: limit,

      // Current page number
      current_page: page,

      // Previous page number
      prev_page: prevPage,

      // Next page number
      next_page: nextPage,

      // Total number of pages
      total_pages: totalPages,
    };
  }
}
