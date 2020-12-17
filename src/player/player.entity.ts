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

  updatePlayer(props: PlayerInterface) {
    this.name = props.name;
    this.score = props.score;
    this.isReady = props.isReady;
    this.roomId = props.roomId;
  }

  addScore(count: number) {
    this.score += count;
  }
}
