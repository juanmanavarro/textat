import { Injectable } from '@nestjs/common';
import { HelpCommand } from '../commands/help.command';
import { SenderService } from '../services/sender.service';
import { FormatService } from '../services/format.service';
import { LanguageCommand } from '../commands/language.command';
import { Commands, InlineCommands } from '../whastapp-service.constants';
import { ParserService } from '../services/parser.service';

@Injectable()
export class CommandListener {
  constructor(
    private readonly senderService: SenderService,
    private readonly helpCommand: HelpCommand,
    private readonly languageCommand: LanguageCommand,
  ) {}

  async handle(user, message) {
    const { command } = ParserService.command(message);

    if ( Object.values(InlineCommands).includes(command) ) {
      this.senderService.textToUser(user.id, 'This command only inline');
      return;
    }

    if ( [Commands.AYUDA, Commands.HELP].includes(command) ) {
      this.helpCommand.execute(user);
    }
    else if ( ['español', 'english'].includes(command) ) {
      this.languageCommand.execute(user, command);
    }
    else {
      this.senderService.textToUser(user.id, [
        [ 'Unkonwn command :command', { command: FormatService.bold(command) } ],
      ]);
    }
  }
}
