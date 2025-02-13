import { BadRequestError } from '../errors/types/bad-request.error';
import { FormatDateInUsaInterface } from '../interfaces/format-date-in-usa.interface';

export class FormatDateInUsa implements FormatDateInUsaInterface {
  /**
   * Formata a data do padrão brasileiro (DD/MM/YYYY) para o padrão americano (YYYY-MM-DD)
   * @param dateInBRLFormat Data no padrão brasileiro (DD/MM/YYYY)
   * @returns Data no padrão americano (YYYY-MM-DD)
   * @throws BadRequestError Se a data for inválida
   */
  execute(dateInBRLFormat: string): string {
    const [day, month, year] = dateInBRLFormat.split('/');

    // Checa se a data informada em string é válida
    if (isNaN(+day) || isNaN(+month) || isNaN(+year)) {
      throw new BadRequestError([
        {
          property: null,
          message: 'Data com formato inválido, use o formato DD/MM/YYYY',
        },
      ]);
    }

    // Cria a data e valida automaticamente
    const date = new Date(+year, +month - 1, +day);

    // Checa se a data é válida
    if (date.getDate() !== +day || date.getMonth() !== +month - 1 || date.getFullYear() !== +year) {
      throw new BadRequestError([
        {
          property: null,
          message: 'Data com formato inválido, use o formato DD/MM/YYYY',
        },
      ]);
    }

    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
}
