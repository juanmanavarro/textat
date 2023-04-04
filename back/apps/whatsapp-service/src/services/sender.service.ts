import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CrypterService } from '@shared/services/crypter.service';
import { LogsService } from '@shared/services/logs.service';
import { UserService } from '@domain/user/user.service';
import { TranslatorService } from './translator.service';
import { ReminderPayloadService } from './reminder-payload.service';
import { ErrorHandlerService } from '@shared/services/error-handler.service';

@Injectable()
export class SenderService {
  constructor(
    private readonly logsService: LogsService,
    private readonly userService: UserService,
    private readonly translatorService: TranslatorService,
  ) {}

  async textToUser(userId: string, message: string | (string|[string, { [key: string]: string }])[]) {
    const user = await this.userService.findOne({ _id: userId });
    if ( !user ) throw new Error("[SenderService.textToUser] User not found");

    this.translatorService.setLanguage(user.language);

    if ( typeof message === 'string' ) message = [ message ];

    const messageToSend = message.map(m => {
      if ( Array.isArray(m) ) {
        return this.translatorService.t(m[0], m[1]);
      }
      return this.translatorService.t(m);
    }).join('\n');

    return this.send(user.phone, ReminderPayloadService.fromString(messageToSend));
  }

  async remind(message) {
    const user = await this.userService.findOne({ _id: message.user.id });
    if ( !user ) throw new Error("[SenderService.remind] User not found");

    return this.send(user.phone, ReminderPayloadService.fromMessage(message));
  }

  private async send(waId, messagePayload) {
    try {
      const { data } = await axios.post(`https://graph.facebook.com/v15.0/${process.env.WHATSAPP_PHONE_ID}/messages`, {
        messaging_product: 'whatsapp',
        to: CrypterService.decrypt(waId),
        ...messagePayload,
      }, {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCOUNT_TOKEN}`,
          'Content-Type': 'application/json',
        }
      });

      this.logsService.message('sender.text', data);

      return { ...data.messages[0], ...messagePayload };
    } catch (error) { ErrorHandlerService.handle(error) }
  }
}
