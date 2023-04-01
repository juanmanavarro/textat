import { Injectable, Logger } from '@nestjs/common';
import { WebsocketServiceGateway } from './websocket-service.gateway';

@Injectable()
export class WebsocketServiceService {
  private logger = new Logger('WebsocketService');

  constructor (
    private readonly websocketGateway: WebsocketServiceGateway,
  ) {}

  getServer() {
    return this.websocketGateway.server;
  }

  emitTo(userId, message, body = null) {
    this.websocketGateway.server.to(userId).emit(message, body);
    this.logger.verbose(`[${userId}] ws: ${message}`);
  }

  emit(message, body = null) {
    this.websocketGateway.server.emit(message, body);
    this.logger.verbose(`[all] ws: ${message}`);
  }
}
