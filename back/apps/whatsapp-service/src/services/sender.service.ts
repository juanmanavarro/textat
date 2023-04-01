import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CrypterService } from '@shared/services/crypter.service';
import { LogsService } from '@shared/services/logs.service';
import { UserService } from '@domain/user/user.service';
import { TranslatorService } from './translator.service';

@Injectable()
export class SenderService {
  constructor(
    private readonly logsService: LogsService,
    private readonly userService: UserService,
    private readonly translatorService: TranslatorService,
  ) {}

  async textToUser(userId: string, message: string | (string|[string, { [key: string]: string }])[]) {
    const user = await this.userService.findOne({ _id: userId });
    if ( !user ) throw new Error("[SenderService] User not found");

    this.translatorService.setLanguage(user.language);

    if ( typeof message === 'string' ) message = [ message ];

    const messageToSend = message.map(m => {
      if ( Array.isArray(m) ) {
        return this.translatorService.t(m[0], m[1]);
      }
      return this.translatorService.t(m);
    }).join('\n');

    this.text(user.phone, messageToSend);
  }

  private async text(waId, message) {
    try {
      const { data } = await axios.post(`https://graph.facebook.com/v15.0/${process.env.WHATSAPP_PHONE_ID}/messages`, {
        messaging_product: "whatsapp",
        to: CrypterService.decrypt(waId),
        type: "text",
        text: {
          body: message,
        },
      }, {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCOUNT_TOKEN}`,
          'Content-Type': 'application/json',
        }
      });

      this.logsService.message('sender.text', { ...data, text: message });

      return data;
    } catch (error) {
      console.log('SenderService.text', error);
      console.log(error.response.data.error);
    }
  }

  async sendPost(waId, post) {
    try {
      await axios.post(
        `https://graph.facebook.com/v15.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
        this.messagePayload(waId, post),
        {
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_ACCOUNT_TOKEN}`,
            'Content-Type': 'application/json',
          }
        });
    } catch (error) {
      console.log('SenderService.sendPost', error);
      console.log(error.response.data.error);
    }
  }

  private messagePayload(waId, post) {
    const payload = {
      messaging_product: "whatsapp",
      to: waId,
      type: post.type,
      text: {
        body: post.message,
      },
    };
    if ( post.type !== 'text' ) {
      payload['id'] = post.content.id;
    }
    return payload;
  }
}
