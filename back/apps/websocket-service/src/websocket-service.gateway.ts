import { AuthService } from '@domain/user/auth.service';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  path: '/',
  cors: {
    origin: '*',
  },
})
export class WebsocketServiceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authService: AuthService,
  ) {}

  async handleConnection(socket) {}

  async handleDisconnect(socket) {}

  @SubscribeMessage('authorization')
  async authorization(@ConnectedSocket() socket: Socket): Promise<WsResponse<any>> {
    try {
      const authed = await this.authService.verify(socket.handshake.auth.token);
      if ( !authed ) {
        socket.emit('auth', 'ws:unauthorized');
        socket.disconnect();
        return;
      }
      socket.join(socket.handshake.auth.user_id);
      return { event: 'auth', data: 'ws:authorized' };
    } catch (error) {
      socket.emit('auth', `ws:${error.name}`);
      socket.disconnect();
    }
  }

  @SubscribeMessage('forceDisconnect')
  async onForceDisconnect(@ConnectedSocket() socket: Socket) {
    const { user_id } = socket.handshake.auth;

    socket.leave(user_id);
    socket.disconnect(true);
    socket.to(user_id).emit('ws:disconnected', user_id);

    socket.on('disconnect', function(){
      socket.to(user_id).emit('ws:disconnected', user_id);
    });
  }
}
