import {
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { MessageInterface } from './message.interface';
import { PlayerEntity } from '../player/player.entity';
import { RoomsService } from '../rooms/rooms.service';
import { ChatService } from './chat.service';
import { wsEvents } from '../shared/constants';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer() wss: Server;

  constructor(
    private roomsService: RoomsService,
    private chatService: ChatService,
  ) {
  }

  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: Server) {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage(wsEvents.toServer.chat.toServer)
  handleMessage(client: Server, message: MessageInterface) {
    console.log(message);
    const isCorrect = this.chatService.validateMessage(message);
    this.wss.to(message.roomId).emit(wsEvents.toClient.chat.toClient, { ...message, isCorrect });
  }

  @SubscribeMessage(wsEvents.toServer.joinRoom)
  handleJoinRoom(client: Socket, { roomId }) {
    client.join(roomId);

    client.emit(wsEvents.toClient.joinedRoom, { roomId });
  }

  @SubscribeMessage(wsEvents.toServer.leaveRoom)
  handleLeaveRoom(client: Socket) {
    const player = this.roomsService.getPlayers(client.id);

    if (player) {
      client.leave(player.roomId);
      client.emit(wsEvents.toClient.leftRoom, player.roomId);
    }
  }
}
