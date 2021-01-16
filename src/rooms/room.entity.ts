import { KEYWORDS } from '../constants/keywords/keywords';
import { PlayerInterface } from '../player/player.interface';
import { PlayerEntity } from '../player/player.entity';
import { MessageInterface } from '../chat/message.interface';
import { RoomInterface } from './room.interface';
import { Server } from 'socket.io';
import { wsEvents } from '../constants/wsEvents';

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
    keyword: null,
    startedAt: null,
    length: 90000,
  };
  winnerId = '';

  private roundInterval: NodeJS.Timeout;

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
      const isAdmin = this.settings.adminId === playerId;
      const isDrawingPlayer = this.round.drawingPlayerId === playerId;

      const playersArray: PlayerInterface[] = Object.values(this.players);
      if (playersArray.length >= 1) {
        if (isAdmin) this.setNewAdmin(playersArray[0].id);
        if (isDrawingPlayer) this.setDrawingPlayer(null, true)
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

  setDrawingPlayer(playerId?: string, isEmpty?: boolean): string {
    if (isEmpty) {
      this.round.drawingPlayerId = '';
      return;
    }

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

  startRound(wss: Server): RoomEntity {
    this.setKeyword();
    this.setDrawingPlayer();
    this.round.isOn = true;
    this.round.roundNo = this.round.roundNo + 1;
    this.round.startedAt = new Date();

    wss.to(this.settings.roomId).emit(wsEvents.toClient.round.updateRound, { ...this.round });
    this.roundLoop(wss);

    return this;
  }

  roundLoop(wss: Server) {
    this.roundInterval = setInterval(() => {
        console.log('round loop');
        const drawingPlayer = this.round.drawingPlayerId
        const currentTime = new Date().getTime();
        const startTime = this.round.startedAt.getTime();

        const isTimeUp = currentTime - startTime >= this.round.length;

        if (this.winnerId || !drawingPlayer || isTimeUp) {
          this.endRound(wss);
        }
      }, 1000);
  }

  endRound(wss: Server): RoomEntity {
    console.log(`${this.winnerId} is the winner`);
    clearInterval(this.roundInterval);
    if (this.winnerId && this.players[this.winnerId]) {
      this.players[this.winnerId].addScore(50);
    }

    const playersArray: PlayerEntity[] = Object.values(this.players);

    this.round.keyword = null;
    this.round.isOn = false;
    this.round.startedAt = null;
    this.winnerId = '';
    playersArray.forEach(player => player.isReady = false);

    this.setDrawingPlayer(null, true)

    wss.to(this.settings.roomId).emit(wsEvents.toClient.round.updateRound, { ...this.round });
    wss.to(this.settings.roomId).emit(wsEvents.toClient.round.updatePlayers, Object.values(this.players));

    return this;
  }

  validateMessage(message: MessageInterface): boolean {
    const isCorrect =
      message.content.toLowerCase() === this.round.keyword.keyword.toLowerCase()
      && !this.winnerId;

    if (isCorrect) this.winnerId = message.senderId;

    return isCorrect;
  }

  cleanUp() {
    clearInterval(this.roundInterval);
  }
}
