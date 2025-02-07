import { RemoveAccentsInterface } from '../interfaces/remove-accents.interface';

export class RemoveAccents implements RemoveAccentsInterface {
  execute(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
