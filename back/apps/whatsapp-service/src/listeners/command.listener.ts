import { Injectable } from '@nestjs/common';
import { HelpCommand } from '../commands/help.command';
import { SenderService } from '../services/sender.service';
import { FormatService } from '../services/format.service';
import { LanguageCommand } from '../commands/language.command';

@Injectable()
export class CommandListener {
  constructor(
    private readonly senderService: SenderService,
    private readonly helpCommand: HelpCommand,
    private readonly languageCommand: LanguageCommand,
  ) {}

  async handle(user, com, message) {
    if ( ['ayuda', 'help'].includes(com.slice(1)) ) {
      this.helpCommand.execute(user);
    }
    else if ( ['español', 'english'].includes(com.slice(1)) ) {
      this.languageCommand.execute(user, com.slice(1));
    }
    else {
      this.senderService.textToUser(user.id, [
        [ 'Unkonwn command :command', { command: FormatService.bold(com) } ],
      ]);
    }
  }
}
