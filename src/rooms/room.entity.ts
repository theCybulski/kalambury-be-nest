import { RoomInterface, RoomRound, RoomSettings } from './room.interface';
import { PlayerInterface } from '../player/player.interface';

export class RoomEntity implements RoomInterface {
  settings = {
    roomId: '',
    adminId: '',
    gameLength: 6,
  };
  players = {};
  round = {
    isOn: false,
    roundNo: 1,
    drawingPlayerId: '',
    keyword: '',
    timer: 0,
  };

  constructor(roomId: string) {
    this.settings.roomId = roomId;
  }

  joinRoom(player: PlayerInterface) {
    this.players = { ...this.players, [player.id]: player };

    if (!this.settings.adminId) {
      this.setNewAdmin(player.id);
    }
  }

  leaveRoom(playerId: string) {
    if (this.players[playerId]) {
      delete this.players[playerId];

      const playersArray: PlayerInterface[] = Object.values(this.players);
      if (this.settings.adminId === playerId && playersArray.length >= 1) {
        this.setNewAdmin(playersArray[0].id);
      }
    }
  }

  updatePlayer(player: PlayerInterface) {
    if (this.players[player.id]) {
      this.players[player.id] = player;

      return this.players;
    }
  }

  updateRound(round: RoomRound) {
    this.round = { ...this.round, ...round };
  }

  setNewAdmin(playerId: string) {
    if (this.players[playerId]) {
      this.settings.adminId = playerId;
    }
  }

  setGameLength(length: number) {
    this.settings.gameLength = length;
  }
}
