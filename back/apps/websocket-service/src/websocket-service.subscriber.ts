import { Controller, Get, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { WebsocketPayload } from '@shared/types/websocket.type';
import { WebsocketServiceService } from './websocket-service.service';

@Controller()
export class WebsocketServiceSubscriber {
  private logger = new Logger('WebsocketServiceSubscriber');

  constructor(
    private readonly websocketService: WebsocketServiceService,
  ) {}

  @MessagePattern([
    'post:created',
    'post:updated',
    'category:created',
    'category:deleted',
    'tag:created',
    'stripe:subscription',
    'stripe:invoice.payment_action_required',
  ])
  onMessage(@Payload() payload: WebsocketPayload) {
    this.logger.verbose(`( ${payload.message} )`);
    this.logger.debug(payload);
    this.websocketService.emitTo(payload.id, payload.message, payload.data);
  }
}
