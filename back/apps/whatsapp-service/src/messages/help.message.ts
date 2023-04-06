import { Injectable } from '@nestjs/common';
import { FormatService } from '../services/format.service';
import { TranslatorService } from '../services/translator.service';
import { repeatMessage } from './repeat.message';

@Injectable()
export class HelpMessage {
  constructor(
    private readonly translatorService: TranslatorService,
  ) {}

  body() {
    return [
      "Here's what you can do:",
      '',
      // FormatService.command(this.translatorService.t('english'), true),
      // 'To change language to English',
      // '',
      '- Send ' + FormatService.command(this.translatorService.t('help'), true) + ' to display this help',
      '',
      '- Reply with ' + FormatService.command(this.translatorService.t('repeat'), true) + ' to repeat the notification',
      '',
      repeatMessage,
    ];
  }
}
