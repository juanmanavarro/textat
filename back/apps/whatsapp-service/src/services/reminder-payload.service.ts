import { Injectable } from '@nestjs/common';
import { FormatService } from './format.service';

@Injectable()
export class ReminderPayloadService {
  static fromMessage(message) {
    return {
      context: { message_id: message.whatsapp_id },
      type: "text",
      text: {
        body: `⏰ ${FormatService.italic('Recordatorio')}`
      },
    }
  }

  static fromString(string) {
    return {
      type: 'text',
      text: { body: string },
    }
  }
}
