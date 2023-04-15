import { Injectable } from '@nestjs/common';
import { SenderService } from '../services/sender.service';
import { FormatService } from '../services/format.service';
import { Commands, InlineCommands } from '../whastapp-service.constants';
import { RepeatCommand } from '../commands/repeat.command';
import { ParserService } from 'apps/whatsapp-service/src/services/parser.service';
import { StopCommand } from '../commands/stop.command';

@Injectable()
export class InlineCommandListener {
  constructor(
    private readonly senderService: SenderService,
    private readonly repeatCommand: RepeatCommand,
    private readonly stopCommand: StopCommand,
  ) {}

  async handle(user, message) {
    const { command } = ParserService.command(message);

    if ( Object.values(Commands).includes(command) ) {
      this.senderService.textToUser(user.id, 'This command can\'t be used inline');
    }
    else if ( [InlineCommands.REPEAT, InlineCommands.REPITE].includes(command) ) {
      this.repeatCommand.execute(user, message);
    }
    else if ( ['stop'].includes(command) ) {
      this.stopCommand.execute(user, message);
    }
    else {
      this.senderService.textToUser(user.id, [
        [ 'Unkonwn command :command', { command: FormatService.bold(command) } ],
      ]);
    }
  }
}
