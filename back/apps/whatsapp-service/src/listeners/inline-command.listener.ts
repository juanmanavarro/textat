import { Injectable } from '@nestjs/common';
import { HelpCommand } from '../commands/help.command';
import { SenderService } from '../services/sender.service';
import { FormatService } from '../services/format.service';
import { LanguageCommand } from '../commands/language.command';
import { Commands, InlineCommands } from '../whastapp-service.constants';

enum INLINE_COMMANDS {
  REPEAT = 'repeat',
};

@Injectable()
export class InlineCommandListener {
  constructor(
    private readonly senderService: SenderService,
    private readonly helpCommand: HelpCommand,
    private readonly languageCommand: LanguageCommand,
  ) {}

  async handle(user, message) {
    const com = message.text.body.slice(1);

    if ( Object.values(Commands).includes(com) ) {
      this.senderService.textToUser(user.id, 'This command cant be used inline');
      return;
    }

    if ( [InlineCommands.REPEAT].includes(com) ) {
      console.log('repeat');
    }
    else {
      this.senderService.textToUser(user.id, [
        [ 'Unkonwn command :command', { command: FormatService.bold(com) } ],
      ]);
    }
  }
}
