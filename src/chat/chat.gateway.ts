import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';

import { RoomsService } from '../rooms/rooms.service';
import { wsEvents } from '../constants/wsEvents';
import { MessageInterface } from './message.interface';

@Injectable()
@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer() wss: Server;

  constructor(
    private roomsService: RoomsService,
  ) {
  }

  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: Server) {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage(wsEvents.toServer.chat.toServer)
  async handleMessage(client: Server, message: MessageInterface) {
    const room = await this.roomsService.getRoomById(message.roomId);
    const isCorrect = room.validateMessage(message);
    this.wss.to(message.roomId).emit(wsEvents.toClient.chat.toClient, { ...message, isCorrect });
  }

  @SubscribeMessage(wsEvents.toServer.joinRoom)
  handleJoinRoom(client: Socket, { roomId }) {
    client.join(roomId);

    client.emit(wsEvents.toClient.joinedRoom, { roomId });
  }

  @SubscribeMessage(wsEvents.toServer.leaveRoom)
  async handleLeaveRoom(client: Socket) {
    try {
      const player = await this.roomsService.getPlayerById(client.id);

      client.leave(player.roomId);
      client.emit(wsEvents.toClient.leftRoom, player.roomId);
    } catch (e) {
      console.log('chat - handle leave room error');
    }
  }
}
