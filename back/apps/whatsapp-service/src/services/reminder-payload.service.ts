import { Injectable } from '@nestjs/common';
import { MessageType } from './post-mapper.service';

@Injectable()
export class ReminderPayloadService {
  static fromMessage(message) {
    switch (message.type) {
      case MessageType.IMAGE:
        return {
          type: 'image',
          image: { id: message.data.id },
        }
        break;
      default:
        return {
          type: 'text',
          text: {
            body: message.text,
          },
        }
        break;
    }
  }

  static fromString(string) {
    return {
      type: 'text',
      text: { body: string },
    }
  }
}
