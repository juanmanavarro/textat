import { Injectable } from '@nestjs/common';
import { MessageFrom } from '../whastapp-service.constants';
import { WhatsappService } from '../whatsapp.service';

@Injectable()
export class CommanderService {
  constructor(
    private readonly whatsappService: WhatsappService,
  ) {}

  send(user, command) {
    if ( !command.startsWith('/') ) command = `/${command}`;
    this.whatsappService.listen(user, { text: { body: command }, from: MessageFrom.APP });
  }
}
