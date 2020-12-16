import { PlayerInterface } from '../player/player.interface';
import { RoomEntity } from './room.entity';
import { Injectable } from '@nestjs/common';
import { PlayerEntity } from '../player/player.entity';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  onlinePlayers = {};
  roomsList = {};

  private addPlayer(player: PlayerInterface) {
    this.onlinePlayers = {
      ...this.onlinePlayers, [player.id]: player,
    };
  }

  private removePlayer(playerId: string) {
    delete this.onlinePlayers[playerId];
  }

  joinRoom(roomId: string, player: PlayerInterface) {
    const room = this.roomsList[roomId];

    if (room) {
      room.joinRoom(player);
      this.addPlayer(player);

      return room;
    }
  }

  leaveRoom(playerId: string) {
    const player = this.onlinePlayers[playerId];
    const room = this.roomsList[player?.roomId];

    if (room) {
      room.leaveRoom(playerId);
      this.removePlayer(playerId);

      const roomIsEmpty = Object.keys(room.players).length === 0;
      if (roomIsEmpty) {
        delete this.roomsList[room.settings.roomId];
      }
    }
  }

  getPlayers(playerId?: string) {
    if (playerId) return this.onlinePlayers[playerId];

    return this.onlinePlayers;
  }

  getRoomsList() {
    return this.roomsList;
  }

  createRoom() {
    const roomsIds = Object.keys(this.roomsList);
    let roomId;

    do {
      roomId = Math.floor(Math.random() * (999999 - 100000) + 100000).toString();
    } while (roomsIds.includes(roomId));

    const newRoom = new RoomEntity(roomId);
    this.roomsList = {
      ...this.roomsList, [newRoom.settings.roomId]: newRoom,
    };

    return newRoom.settings.roomId;
  }
}
