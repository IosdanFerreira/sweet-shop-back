import { RemoveAccentsInterface } from '../interfaces/remove-accents.interface';

export class RemoveAccents implements RemoveAccentsInterface {
  /**
   * Executa a remoção de acentos do texto fornecido.
   *
   * @param text - O texto do qual os acentos devem ser removidos.
   * @returns O texto sem acentos.
   */
  execute(text: string): string {
    // Normaliza o texto para transformar caracteres acentuados em caracteres básicos.
    // Em seguida, utiliza uma expressão regular para remover os acento.
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
