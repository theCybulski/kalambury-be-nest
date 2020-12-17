import { KEYWORDS } from '../constants/keywords';
import { PlayerInterface } from '../player/player.interface';
import { PlayerEntity } from '../player/player.entity';
import { MessageInterface } from '../chat/message.interface';
import { RoomInterface } from './room.interface';

export class RoomEntity implements RoomInterface {
  settings = {
    roomId: '',
    adminId: '',
    gameLength: 6,
  };
  players = {};
  round = {
    isOn: false,
    roundNo: 0,
    drawingPlayerId: '',
    keyword: '',
    timer: 0,
  };
  winnerId = '';

  constructor(roomId: string) {
    this.settings.roomId = roomId;
  }

  joinRoom(player: PlayerInterface) {
    this.players = { ...this.players, [player.id]: player };

    if (!this.settings.adminId) {
      this.setNewAdmin(player.id);
    }
  }

  leaveRoom(playerId: string): RoomEntity {
    if (this.players[playerId]) {
      delete this.players[playerId];

      const playersArray: PlayerInterface[] = Object.values(this.players);
      if (this.settings.adminId === playerId && playersArray.length >= 1) {
        this.setNewAdmin(playersArray[0].id);
      }
    }

    return this;
  }

  updatePlayer(props: PlayerInterface) {
    if (this.players[props.id]) {
      this.players[props.id].updatePlayer(props);

      return this.players;
    }
  }

  setNewAdmin(playerId: string) {
    if (this.players[playerId]) {
      this.settings.adminId = playerId;
    }
  }

  setDrawingPlayer(playerId?: string): string {
    if (playerId) {
      this.round.drawingPlayerId = playerId;
      return playerId;
    }

    const playersArray = Object.values(this.players) as PlayerInterface[];
    const drawingPlayerIndex =
      playersArray.findIndex(player => player.id === this.round.drawingPlayerId);

    if (drawingPlayerIndex === -1 || drawingPlayerIndex + 1 > playersArray.length - 1) {
      this.round.drawingPlayerId = playersArray[0].id;
    } else {
      this.round.drawingPlayerId = playersArray[drawingPlayerIndex + 1].id;
    }

    return this.round.drawingPlayerId;
  }

  countdownTimer(valueToCountDown: number): number {
    if (this.round.timer > 0) {
      this.round.timer -= valueToCountDown;
    }
    return this.round.timer;
  }

  setKeyword() {
    const keywordsIndexes = [];
    const min = 0;
    const max = KEYWORDS.length - 1;

    while (keywordsIndexes.length < 3) {
      const randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!keywordsIndexes.includes(randomIndex)) {
        keywordsIndexes.push(randomIndex);
      }
    }

    this.round.keyword = KEYWORDS[keywordsIndexes[0]];
    return this.round.keyword;
  }

  startRound(): RoomEntity {
    this.round.isOn = true;
    this.round.roundNo = this.round.roundNo + 1;
    this.round.timer = 90;

    return this;
  }

  endRound(): RoomEntity {
    console.log(`${this.winnerId} is the winner`);
    if (this.winnerId && this.players[this.winnerId]) {
      this.players[this.winnerId].addScore(50);
    }

    const playersArray: PlayerEntity[] = Object.values(this.players);

    this.round.keyword = '';
    this.round.isOn = false;
    this.round.timer = 0;
    this.winnerId = '';
    playersArray.forEach(player => player.isReady = false);

    return this;
  }

  validateMessage(message: MessageInterface): boolean {
    const isCorrect =
      message.content.toLowerCase() === this.round.keyword.toLowerCase()
      && !this.winnerId;

    if (isCorrect) this.winnerId = message.senderId;

    return isCorrect;
  }
}
