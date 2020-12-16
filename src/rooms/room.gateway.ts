import {
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { RoomsService } from './rooms.service';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { PlayerEntity } from '../player/player.entity';
import { socketErrorToClient } from '../utils/socketErrorToClient';
import { wsEvents } from '../shared/constants';
import { PlayerInterface } from '../player/player.interface';

@WebSocketGateway({ namespace: '/room' })
export class RoomGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;

  constructor(
    private roomsService: RoomsService,
  ) {
  }

  private logger: Logger = new Logger('RoomGateway');

  handleDisconnect(client: Socket) {
    const player = this.roomsService.getPlayers(client.id);

    if (player) {
      this.roomsService.leaveRoom(client.id);
      const room = this.roomsService.roomsList[player.roomId];

      if (room) {
        this.wss.to(player.roomId).emit(wsEvents.toClient.round.updateSettings, { ...this.roomsService.roomsList[player.roomId].settings });
        this.wss.to(player.roomId).emit(wsEvents.toClient.round.updatePlayers, Object.values(room.players));
      }
    }
  }

  afterInit(server: Server) {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage(wsEvents.toServer.joinRoom)
  handleJoinRoom(client: Socket, { roomId, name }) {
    const room = this.roomsService.roomsList[roomId];

    if (room) {
      client.join(roomId);

      const player = new PlayerEntity(name, client.id, roomId);
      const room = this.roomsService.joinRoom(roomId, player);
      console.log(`${player.name} joined room #${roomId}`);

      const newRoom = { ...room, players: Object.values(room.players) };

      client.emit(wsEvents.toClient.joinedRoom, { player, room: newRoom });
      this.wss.to(roomId).emit(wsEvents.toClient.round.updatePlayers, Object.values(room.players));
    } else {
      socketErrorToClient(client, 404, `Room ${roomId} not found`);
    }
  }

  @SubscribeMessage(wsEvents.toServer.leaveRoom)
  handleLeaveRoom(client: Socket, roomId) {
    const player = this.roomsService.getPlayers(client.id);
    const room = this.roomsService.roomsList[roomId];
    this.roomsService.leaveRoom(client.id);

    if (player) {
      client.leave(roomId);
      console.log(`${player.name} left room #${player.roomId}`);
      client.emit(wsEvents.toClient.leftRoom, player.roomId);
    }

    if (room) {
      this.wss.to(roomId).emit(wsEvents.toClient.round.updateSettings, { ...this.roomsService.roomsList[player.roomId].settings });
      this.wss.to(roomId).emit(wsEvents.toClient.round.updatePlayers, Object.values(room.players));
    }
  }

  @SubscribeMessage(wsEvents.toServer.round.updatePlayers)
  handleUpdatePlayer(client: Socket, player: PlayerInterface) {
    const room = this.roomsService.roomsList[player.roomId];
    const updatedPlayers = room.updatePlayer(player);

    if (room) {
      this.wss.to(player.roomId).emit(wsEvents.toClient.round.updatePlayers, Object.values(updatedPlayers));
    }
  }

  @SubscribeMessage(wsEvents.toServer.round.flipchart)
  handleFlipchart(client: Socket, { data, roomId }) {
    const room = this.roomsService.roomsList[roomId];

    if (room) {
      this.wss.to(roomId).emit(wsEvents.toClient.round.flipchart, data);
    }
  }
}
