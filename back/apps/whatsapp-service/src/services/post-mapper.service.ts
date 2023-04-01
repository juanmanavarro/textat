import { Injectable } from '@nestjs/common';
import { MediaService } from './media.service';
import { UrlService } from './url.service';

export enum MessageType {
  AUDIO    = 'audio',
  IMAGE    = 'image',
  VIDEO    = 'video',
  VCARD    = 'vcard',
  DOCUMENT = 'document',
  LOCATION = 'location',
  LINK     = 'link',
  TEXT     = 'text',
  UNKNOWN  = 'unknown',
};

@Injectable()
export class PostMapperService {
  constructor(
    private readonly mediaService: MediaService,
  ) {}

  async map(user, message) {
    if ( !message.id ) return [];

    if ( message.type === MessageType.TEXT && UrlService.extractUrl(message.text.body) ) {
      message.type = MessageType.LINK;
    }

    const post = {
      user_id: user.id,
      whatsapp_id: message.id,
      type: message.type,
    };

    try {
      const map = await this[`${message.type}Mapper`](message);
      return map.map(m => ({ ...m, ...post }));
    } catch (error) {
      console.log(`${message.type}Mapper`, error.message);
      return [{ ...post, type: MessageType.UNKNOWN, ...this.unknownMapper() }];
    }
  }

  private unknownMapper() {
    return {
      text: 'No reconocemos aún este tipo de mensajes. Estamos trabajando en ello. Gracias.',
    };
  }

  private textMapper(message) {
    return [{ text: message.text.body }];
  }

  private async contactsMapper(message) {
    return message.contacts.map(c => {
      return {
        text: c.name.formatted_name || c.name.first_name,
        data: { phones: c.phones },
      }
    });
  }

  private async imageMapper(message) {
    return [{
      text: message.image.caption || '',
      data: await this.mediaService.getContent(message.image.id),
    }];
  }

  private async documentMapper(message) {
    return [{
      text: message.document.filename,
      data: await this.mediaService.getContent(message.document.id),
    }];
  }

  private locationMapper(message) {
    return [{
      text: message.location.name ? `${message.location.name}, ${message.location.address}` : '',
      data: message.location,
    }];
  }

  private async videoMapper(message) {
    return [{
      text: message.video.caption || '',
      data: await this.mediaService.getContent(message.video.id),
    }];
  }

  private async audioMapper(message) {
    return [{
      text: 'audio message',
      data: await this.mediaService.getContent(message.audio.id)
    }];
  }

  private async linkMapper(message) {
    const data = await UrlService.preview(message.text.body);

    return data.type === 'error' ? [{
      text: data.original_url,
      data: {
        host: data.provider_name,
        title: data.title,
        description: data.description,
        image: data.images[0]?.url || null,
      },
    }] : [{
      text: data.url,
      data: {
        host: data.provider_display,
        title: data.title,
        description: data.description,
        image: data.images[0]?.url || null,
      },
    }];
  }
}
