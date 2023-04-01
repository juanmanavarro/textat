import * as Cryptr from 'cryptr';

export class CrypterService {
  static encrypt(string) {
    const cryptr = new Cryptr(process.env.CRYPTER_SECRET);

    return cryptr.encrypt(string);
  }

  static decrypt(string) {
    if ( !string ) return string;

    const cryptr = new Cryptr(process.env.CRYPTER_SECRET);
    return cryptr.decrypt(string);
  }

  static compare(clean: string, encrypted: string) {
    return clean === CrypterService.decrypt(encrypted);
  }
}
