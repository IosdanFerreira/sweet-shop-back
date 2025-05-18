import { RemoveAccentsInterface } from '../interfaces/remove-accents.interface';

export class RemoveAccents implements RemoveAccentsInterface {
  /**
   * Removes accents from the provided text.
   *
   * @param text - The input string from which accents are to be removed.
   * @returns The string with accents removed.
   */
  execute(text: string): string {
    // Normalize the text to separate accents from characters
    // Replace the separated accents using a regular expression
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
