import { ContactService } from "@domain/contact/contact.service";
import { Injectable } from "@nestjs/common";
import { SenderService } from "../services/sender.service";

@Injectable()
export class ContactCommand {
  constructor(
    private readonly contactService: ContactService,
    private readonly senderService: SenderService,
  ) {}

  async execute(user, message) {
    if ( !message ) {
      this.senderService.textToUser(user.id, [
        "To contact us send /contact followed by the message. For example:",
        '',
        '/contact help needed',
      ]);
      return;
    }

    await this.contactService.create({ user_id: user.id, message });
    this.senderService.textToUser(user.id, 'Thank you! We will be in touch soon');
  }
}
