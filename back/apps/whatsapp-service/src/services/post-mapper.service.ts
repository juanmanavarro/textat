import { Injectable } from '@nestjs/common';
import { MediaService } from './media.service';
import { UrlService } from './url.service';

export enum PostType {
  AUDIO = 'audio',
  IMAGE = 'image',
  VIDEO = 'video',
  VCARD = 'vcard',
  DOCUMENT = 'document',
  LOCATION = 'location',
  LINK = 'link',
  TEXT = 'text',
  UNKNOWN = 'unknown',
};

@Injectable()
export class PostMapperService {
  constructor(
    private readonly mediaService: MediaService,
  ) {}

  async map(user, message) {
    if ( !message.id ) return [];

    if ( message.type === PostType.TEXT && UrlService.extractUrl(message.text.body) ) {
      message.type = PostType.LINK;
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
      return [{ ...post, type: PostType.UNKNOWN, ...this.unknownMapper() }];
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
        title: c.name.formatted_name || c.name.first_name,
        content: { phones: c.phones },
      }
    });
  }

  private async imageMapper(message) {
    return [{
      title: message.image.caption || '',
      text: '',
      content: await this.mediaService.getContent(message.image.id),
    }];
  }

  private async documentMapper(message) {
    return [{
      title: message.document.filename,
      text: '',
      content: await this.mediaService.getContent(message.document.id),
    }];
  }

  private locationMapper(message) {
    return [{
      title: message.location.name || `${message.location.latitude}, ${message.location.longitude}`,
      subtitle: message.location.address,
      text: message.location.name ? `${message.location.name}, ${message.location.address}` : '',
      content: message.location,
    }];
  }

  private async videoMapper(message) {
    return [{
      title: message.video.caption || '',
      text: '',
      content: await this.mediaService.getContent(message.video.id),
    }];
  }

  private async audioMapper(message) {
    return [{ content: await this.mediaService.getContent(message.audio.id) }];
  }

  private async linkMapper(message) {
    const data = await UrlService.preview(message.text.body);

    return data.type === 'error' ? [{
      title: data.provider_name,
      subtitle: data.title,
      link: data.original_url,
      text: data.description,
      image: data.images[0]?.url || null,
      data,
    }] : [{
      title: data.provider_display,
      subtitle: data.title,
      link: data.url,
      text: data.description,
      image: data.images[0]?.url || null,
      data,
    }];
  }
}
