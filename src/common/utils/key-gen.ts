import { customAlphabet } from 'nanoid';

export class KeyGen {
  /* istanbul ignore next */
  static gen(length: number, type?: string): string {
    let dict: string;
    switch (type) {
      case 'numeric':
        dict = '0123456789';
        break;

      default:
        dict = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        break;
    }
    const nanoid = customAlphabet(dict, length);
    return nanoid();
  }
}
