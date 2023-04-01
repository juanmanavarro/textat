import * as Crypto from 'crypto-js';

export class HasherService {
  static hash(string) {
    return Crypto
      .SHA256(string, process.env.CRYPTER_SECRET)
      .toString();
  }

  static compare(clean: string, hashed: string) {
    return HasherService.hash(clean) === hashed;
  }
}
