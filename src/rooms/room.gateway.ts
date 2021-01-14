import {
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

import { PlayerEntity } from '../player/player.entity';
import { socketErrorToClient } from '../utils/socket-error-to-client';
import { wsEvents } from '../constants/wsEvents';
import { PlayerInterface } from '../player/player.interface';
import { RoomsService } from './rooms.service';

@WebSocketGateway({ namespace: '/room' })
export class RoomGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;

  constructor(
    private roomsService: RoomsService,
  ) {
  }

  private logger: Logger = new Logger('RoomGateway');

  async handleDisconnect(client: Socket) {
    try {
      const room = await this.roomsService.leaveRoom(client.id);

      this.wss.to(room.settings.roomId).emit(wsEvents.toClient.round.updateSettings, { ...room.settings });
      this.wss.to(room.settings.roomId).emit(wsEvents.toClient.round.updatePlayers, Object.values(room.players));
    } catch (e) {
      console.log('handle disconnect error', e);
    }
  }

  afterInit(server: Server) {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage(wsEvents.toServer.joinRoom)
  async handleJoinRoom(client: Socket, { roomId, name }) {
    const player = new PlayerEntity(name, client.id, roomId);

    try {
      const room = await this.roomsService.joinRoom(roomId, player);
      const roomForClient = { ...room, players: Object.values(room.players) };

      client.join(roomId);

      client.emit(wsEvents.toClient.joinedRoom, { player, room: roomForClient });
      this.wss.to(roomId).emit(wsEvents.toClient.round.updatePlayers, Object.values(room.players));
      console.log(`${player.name} joined room #${roomId}`);
    } catch (e) {
      console.log('handle join room error');
      socketErrorToClient(client, 404, `Room ${roomId} not found`);
    }
  }

  @SubscribeMessage(wsEvents.toServer.leaveRoom)
  async handleLeaveRoom(client: Socket, roomId) {
    try {
      const player = await this.roomsService.getPlayerById(client.id);

      this.roomsService.leaveRoom(player.id);
      client.leave(roomId);
      client.emit(wsEvents.toClient.leftRoom, player.roomId);

      console.log(`${player.name} left room #${player.roomId}`);

      const room = await this.roomsService.getRoomById(roomId);

      this.wss.to(roomId).emit(wsEvents.toClient.round.updateSettings, { ...room.settings });
      this.wss.to(roomId).emit(wsEvents.toClient.round.updatePlayers, Object.values(room.players));
    } catch (e) {
      console.log('handle leave room error', e);
    }
  }

  // TODO: Disallow client to update players with PlayerInterface - risk of score manipulation
  @SubscribeMessage(wsEvents.toServer.round.updatePlayers)
  async handleUpdatePlayer(client: Socket, player: PlayerInterface) {
    try {
      const room = await this.roomsService.getRoomById(player.roomId);

      const updatedPlayers = room.updatePlayer(player);
      this.wss.to(player.roomId).emit(wsEvents.toClient.round.updatePlayers, Object.values(updatedPlayers));
    } catch (e) {
      console.log('handle update player error', e);
    }
  }

  @SubscribeMessage(wsEvents.toServer.round.flipchart)
  handleFlipchart(client: Socket, { data, roomId }) {
    this.wss.to(roomId).emit(wsEvents.toClient.round.flipchart, data);
  }

  @SubscribeMessage(wsEvents.toServer.round.start)
  async handleStartRound(client: Socket, { roomId }) {
    try {
      const room = await this.roomsService.getRoomById(roomId);

      room.setKeyword();
      room.setDrawingPlayer();
      const startedRoundRoom = room.startRound();

      this.wss.to(roomId).emit(wsEvents.toClient.round.updateRound, { ...startedRoundRoom.round });

      // TODO: Consider storing only start time and calculating timer on FE
      const timerInterval = setInterval(async () => {
        try {
          await this.roomsService.getRoomById(roomId);
          const timer = room.countdownTimer(1);

          this.wss.to(roomId).emit(wsEvents.toClient.round.updateTimer, { timer });

          if (room.winnerId || timer <= 0) {
            clearInterval(timerInterval);
            const endedRoundRoom = room.endRound();
            this.wss.to(roomId).emit(wsEvents.toClient.round.updateRound, { ...endedRoundRoom.round });
            this.wss.to(roomId).emit(wsEvents.toClient.round.updatePlayers, Object.values(endedRoundRoom.players));
          }

        } catch (e) {
          clearTimeout(timerInterval);
        }
      }, 1000);
    } catch (e) {
      console.log('handle start round error');
    }
  }
}
