import { PlayerInterface } from './player.interface';

export class PlayerEntity implements PlayerInterface {
  id = '';
  name = '';
  score = 0;
  isReady = false;
  roomId = '';

  constructor(name: string, socketId: string, roomId: string) {
    this.id = socketId;
    this.name = name;
    this.roomId = roomId;
  }

  updateScore(score: number) {
    this.score = score;
  }

  updateIsReady(isReady: boolean) {
    this.isReady = isReady;
  }
}
