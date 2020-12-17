import { Injectable, NotFoundException } from '@nestjs/common';

import { PlayerInterface } from '../player/player.interface';
import { PlayerEntity } from '../player/player.entity';
import { RoomEntity } from './room.entity';

@Injectable()
export class RoomsService {
  onlinePlayers = {};
  roomsList = {};

  constructor() {
    this.createRoom('testRoom');
  }

  private addPlayer(player: PlayerInterface) {
    this.onlinePlayers = {
      ...this.onlinePlayers, [player.id]: player,
    };
  }

  private removePlayer(playerId: string) {
    delete this.onlinePlayers[playerId];
  }

  async joinRoom(roomId: string, player: PlayerInterface): Promise<RoomEntity> {
    try {
      const room = await this.getRoomById(roomId);

      room.joinRoom(player);
      this.addPlayer(player);

      return room;
    } catch (e) {
      console.log('ERROR JOINROOM SERVICE');
    }
  }

  createRoom(roomId?: string): string {
    const roomsIds = Object.keys(this.roomsList);
    let newRoomId = roomId;

    if (!roomId) {
      do {
        newRoomId = Math.floor(Math.random() * (999999 - 100000) + 100000).toString();
      } while (roomsIds.includes(roomId));
    }

    const newRoom = new RoomEntity(newRoomId);
    this.roomsList = {
      ...this.roomsList, [newRoom.settings.roomId]: newRoom,
    };

    return newRoom.settings.roomId;
  }

  async leaveRoom(playerId: string): Promise<RoomEntity> {
    try {
      const player = await this.getPlayerById(playerId);
      const room = await this.getRoomById(player.roomId);

      const leftRoom = room.leaveRoom(playerId);
      this.removePlayer(playerId);

      const isRoomEmpty = Object.keys(room.players).length === 0;
      if (isRoomEmpty) {
        delete this.roomsList[room.settings.roomId];
        return;
      }

      return leftRoom;
    } catch (e) {
      console.log('leave room service error');
    }
  }

  getPlayers() {
    return this.onlinePlayers;
  }

  async getPlayerById(playerId?: string): Promise<PlayerEntity> {
    const found = await this.onlinePlayers[playerId];

    if (!found) {
      throw new NotFoundException(`Player with id ${playerId} not found!`);
    }

    return found;
  }

  getRooms() {
    return this.roomsList;
  }

  async getRoomById(roomId: string): Promise<RoomEntity> {
    const found = await this.roomsList[roomId];

    if (!found) {
      throw new NotFoundException(`Room with ID "${roomId}" not found`);
    }

    return found;
  }
}
