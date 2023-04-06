import { Injectable } from '@nestjs/common';

@Injectable()
export class ReminderPayloadService {
  static fromMessage(message) {
    return {
      type: "text",
      text: {
        body: `${message.text}\n\n⏰`
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
