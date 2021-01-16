import { PlayerInterface } from '../player/player.interface';
import { Keyword } from '../constants/keywords/keywords';

export type RoomSettings = {
  roomId: string;
  adminId: string;
  gameLength: number;
}

export type RoomRound = {
  isOn: boolean
  roundNo: number;
  drawingPlayerId: string;
  keyword: Keyword;
  startedAt: Date;
  length: number;
};

export interface RoomInterface {
  settings: RoomSettings;
  players: {
    [playerId: string]: PlayerInterface
  }
  round: RoomRound
}
