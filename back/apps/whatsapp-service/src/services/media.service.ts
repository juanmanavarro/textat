import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MediaService {
  async getContent(id) {
    const { data } = await axios.get(`https://graph.facebook.com/v15.0/${id}`, {
      headers: { Authorization: `Bearer ${process.env.WHATSAPP_ACCOUNT_TOKEN}`}
    });
    const res = await axios.get(data.url, {
      headers: { Authorization: `Bearer ${process.env.WHATSAPP_ACCOUNT_TOKEN}` },
      responseType: 'arraybuffer',
      responseEncoding: 'binary',
    });
    data['base64'] = Buffer.from(res.data, "binary").toString('base64');
    return data;
  }
}
