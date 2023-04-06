import { Injectable } from "@nestjs/common";
import { SenderService } from "../services/sender.service";
import { MessageService } from "@domain/message/message.service";

@Injectable()
export class StopCommand {
  constructor(
    private readonly senderService: SenderService,
    private readonly messageService: MessageService,
  ) {}

  async execute(user, message) {
    const stoppable = await this.messageService.findOne({
      $or: [
        { whatsapp_id: message.context.id },
        { related_message_ids: message.context.id }
      ],
      repeat: { $ne: null },
    });

    if ( !stoppable ) {
      this.senderService.textToUser(user.id, 'This message will no longer be repeated');
      return;
    }

    stoppable.repeat = null;
    await stoppable.save();

    this.senderService.textToUser(user.id, 'This message will no longer be repeated');
  }
}
