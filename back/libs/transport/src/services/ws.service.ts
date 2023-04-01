import { Injectable } from '@nestjs/common';
import { TransportService } from '../transport.service';

@Injectable()
export class WsService {
  constructor(
    private readonly transportService: TransportService,
  ) {}

  send(userId, event, data = {}) {
    this.transportService.send(event, {
      id: userId,
      data,
    });
  }
}
