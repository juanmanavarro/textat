import { Injectable } from '@nestjs/common';
import { __ } from '@squareboat/nestjs-localization';

@Injectable()
export class TranslatorService {
  private language;

  setLanguage(lang) {
    this.language = lang !== 'es' ? 'en' : 'es';
  }

  t(string, params = {}) {
    const translation = __(string, this.language, params);
    return translation.startsWith('ERR::INVALID KEY ==> ')
      ? translation.replace('ERR::INVALID KEY ==> ', '')
      : translation;
  }
}
