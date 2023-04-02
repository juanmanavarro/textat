import { Injectable } from '@nestjs/common';
import { FormatService } from './format.service';

@Injectable()
export class ReminderPayloadService {
  static fromMessage(message) {
    return {
      type: "text",
      text: {
        body: `${message.text}

⏰ ${FormatService.italic('Recordatorio')}`
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
