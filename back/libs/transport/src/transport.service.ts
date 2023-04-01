import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TransportService {
  constructor(
    @Inject('EVENT_EMITTER') private client: ClientProxy,
  ) { }

  async send(message, data) {
    return await this.client.send(message, { message, ...data }).subscribe();
  }
}
