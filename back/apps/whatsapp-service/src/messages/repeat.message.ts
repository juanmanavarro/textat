import { Injectable } from "@nestjs/common";
import { FormatService } from "../services/format.service";
import { REPEAT_PARAMETERS } from "../whastapp-service.constants";
import { TranslatorService } from "../services/translator.service";

@Injectable()
export class RepeatMessage {
  constructor(
    private readonly translatorService: TranslatorService,
  ) {}

  body() {
    return Object.keys(REPEAT_PARAMETERS).map(r => {
      return this.translatorService.t(`:command to be repeated every :period`, {
        command: FormatService.command(this.translatorService.t('repeat :p', { p: r }), true),
        period: this.translatorService.t(REPEAT_PARAMETERS[r]),
        p: r,
      });
    }).join('\n');
  }
}
