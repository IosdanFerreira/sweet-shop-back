import { PaginationInterface, PaginationResponseInterface } from '../interfaces/pagination.interface';

export class Pagination implements PaginationInterface {
  /**
   * Gera a paginação para a resposta padrão do sistema.
   *
   * @param totalItems O número total de itens em uma determinada lista.
   * @param page O número da página atual.
   * @param limit Número de itens por página.
   *
   * @returns Paginação formatada.
   */
  generate(totalItems: number, page: number, limit: number): PaginationResponseInterface {
    const totalPages = Math.ceil(totalItems / limit);

    /**
     * Número da página anterior, caso exista.
     *
     * Se a página atual for a primeira, retorna null.
     */
    const prevPage = page > 1 ? page - 1 : null;

    /**
     * Número da próxima página, caso exista.
     *
     * Se a p gina atual for a  última, retorna null.
     */
    const nextPage = page < totalPages ? page + 1 : null;

    return {
      /**
       * Número total de itens em uma determinada lista.
       */
      total_items: totalItems,
      /**
       * Número de itens por p gina.
       */
      limit_per_page: limit,
      /**
       * Número da p gina atual.
       */
      current_page: page,
      /**
       * Número da p gina anterior, caso exista.
       */
      prev_page: prevPage,
      /**
       * Número da próxima p gina, caso exista.
       */
      next_page: nextPage,
      /**
       * Número total de páginas.
       */
      total_pages: totalPages,
    };
  }
}
