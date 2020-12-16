import { PlayerInterface } from '../player/player.interface';

export type RoomSettings = {
  roomId: string;
  adminId: string;
  gameLength: number;
}

export type RoomRound = {
  isOn: boolean
  roundNo: number;
  drawingPlayerId: string;
  keyword: string;
  timer: number;
};

export interface RoomInterface {
  settings: RoomSettings;
  players: {
    [playerId: string]: PlayerInterface
  }
  round: RoomRound
}
