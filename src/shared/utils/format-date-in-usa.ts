import { BadRequestError } from '../errors/types/bad-request.error';
import { FormatDateInUsaInterface } from '../interfaces/format-date-in-usa.interface';

export class FormatDateInUsa implements FormatDateInUsaInterface {
  /**
   * This function takes a date in the Brazilian format DD/MM/YYYY and
   * returns the date in the format YYYY-MM-DD. If the date is invalid, it
   * throws a BadRequestError with a message indicating the error.
   *
   * @param {string} dateInBRLFormat - The date in the Brazilian format DD/MM/YYYY.
   * @returns {string} - The date in the format YYYY-MM-DD.
   */
  execute(dateInBRLFormat: string): string {
    const [day, month, year] = dateInBRLFormat.split('/');

    // Check if the day, month and year are valid numbers
    if (isNaN(+day) || isNaN(+month) || isNaN(+year)) {
      throw new BadRequestError('Erro ao validar a data fornecida', [
        {
          property: null,
          message: 'Data com formato inválido, use o formato DD/MM/YYYY',
        },
      ]);
    }

    // Create a new date object with the parsed values
    const date = new Date(+year, +month - 1, +day);

    // Check if the date created is valid
    if (date.getDate() !== +day || date.getMonth() !== +month - 1 || date.getFullYear() !== +year) {
      throw new BadRequestError('Erro ao validar a data fornecida', [
        {
          property: null,
          message: 'Data com formato inválido, use o formato DD/MM/YYYY',
        },
      ]);
    }

    // Return the date in the format YYYY-MM-DD
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
}
