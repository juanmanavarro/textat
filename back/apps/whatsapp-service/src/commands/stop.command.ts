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

    stoppable.repeat = null;
    await stoppable.save();

    // TODO improve message
    this.senderService.textToUser(user.id, 'The message will stop repeating');
  }
}
