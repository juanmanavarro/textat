import { Injectable } from '@nestjs/common';
import { FormatService } from '../services/format.service';
import { TranslatorService } from '../services/translator.service';
import { RepeatMessage } from './repeat.message';

@Injectable()
export class HelpMessage {
  constructor(
    private readonly repeatMessage: RepeatMessage,
    private readonly translatorService: TranslatorService,
  ) {}

  body() {
    return [
      "Here's what you can do:",
      '',
      FormatService.command(this.translatorService.t('english'), true),
      'To change language to English',
      '',
      FormatService.command(this.translatorService.t('help'), true),
      this.translatorService.t('To display this help'),
      '',
      FormatService.command(this.translatorService.t('repeat'), true) + ` ${this.translatorService.t('(as a reply to a message)')}`,
      this.translatorService.t('To repeat the notification'),
      '',
      this.repeatMessage.body(),
      '',
      FormatService.command(this.translatorService.t('stop'), true) + ` ${this.translatorService.t('(as a reply to a message)')}`,
      this.translatorService.t('To stop the notification from repeating'),
      '',
    ];
  }
}
