import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class UrlService {
  static async preview(url) {
    try {
      const { data } = await axios.get('http://api-cdn.embed.ly/1/card-details', {
        params: {
          card: 1,
          key: process.env.EMBEDLY_KEY,
          native: true,
          scheme: 'https',
          urls: UrlService.extractUrl(url),
          youtube_showinfo: 0,
        }
      });
      return data[0];
    } catch (error) {
      console.log('UrlService.preview', error);
    }
  }

  static extractUrl(string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = string.match(urlRegex);
    if ( !urls?.length ) return null;
    return urls[0];
  }
}
