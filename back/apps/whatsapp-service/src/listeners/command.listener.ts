import { Injectable } from '@nestjs/common';
import { HelpCommand } from '../commands/help.command';
import { SenderService } from '../services/sender.service';
import { FormatService } from '../services/format.service';
import { LanguageCommand } from '../commands/language.command';
import { Commands, InlineCommands } from '../whastapp-service.constants';

@Injectable()
export class CommandListener {
  constructor(
    private readonly senderService: SenderService,
    private readonly helpCommand: HelpCommand,
    private readonly languageCommand: LanguageCommand,
  ) {}

  async handle(user, message) {
    const com = message.text.body.slice(1);

    if ( Object.values(InlineCommands).includes(com) ) {
      this.senderService.textToUser(user.id, 'This command only inline');
      return;
    }

    if ( [Commands.AYUDA, Commands.HELP].includes(com) ) {
      this.helpCommand.execute(user);
    }
    else if ( ['español', 'english'].includes(com) ) {
      this.languageCommand.execute(user, com);
    }
    else {
      this.senderService.textToUser(user.id, [
        [ 'Unkonwn command :command', { command: FormatService.bold(com) } ],
      ]);
    }
  }
}
