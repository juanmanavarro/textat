import { Injectable } from "@nestjs/common";
import { SenderService } from "../services/sender.service";
import { TranslatorService } from "../services/translator.service";
import { UserService } from "@domain/user/user.service";

@Injectable()
export class LanguageCommand {
  constructor(
    private readonly senderService: SenderService,
    private readonly translatorService: TranslatorService,
    private readonly userService: UserService,
  ) {}

  async execute(user = null, command) {
    const language = command === 'español' ? 'es' : 'en';

    const u = await this.userService.findOne({ _id: user.id });
    if ( u.language === language) {
      this.senderService.textToUser(
        user.id,
        'The current language is English',
      );
      return;
    }

    u.language = language;
    await u.save();

    this.translatorService.setLanguage(u.language);

    this.senderService.textToUser(
      user.id,
      'Language changed to English',
    );
  }
}
