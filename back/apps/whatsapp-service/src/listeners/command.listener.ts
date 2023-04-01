import { Injectable } from '@nestjs/common';
import { HelpCommand } from '../commands/help.command';
import { PocketCommand } from '../commands/pocket.command';
import { SenderService } from '../services/sender.service';
import { FormatService } from '../services/format.service';
import { ContactCommand } from '../commands/contact.command';
import { LanguageCommand } from '../commands/language.command';

@Injectable()
export class CommandListener {
  constructor(
    private readonly senderService: SenderService,
    private readonly helpCommand: HelpCommand,
    private readonly pocketCommand: PocketCommand,
    private readonly contactCommand: ContactCommand,
    private readonly languageCommand: LanguageCommand,
  ) {}

  async handle(user, com, message) {
    if ( ['contacto', 'contact'].includes(com.slice(1)) ) {
      this.contactCommand.execute(user, message);
    }
    else if ( ['ayuda', 'help'].includes(com.slice(1)) ) {
      this.helpCommand.execute(user);
    }
    else if ( ['pocket'].includes(com.slice(1)) ) {
      this.pocketCommand.execute(user, message);
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
