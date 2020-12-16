import { MessageInterface } from './message.interface';
import { RoomsService } from '../rooms/rooms.service';
import { Injectable } from '@nestjs/common';
import { RoomEntity } from '../rooms/room.entity';

@Injectable()
export class ChatService {
  constructor(
    private roomsService: RoomsService,
  ) {
  }

  validateMessage(message: MessageInterface) {
    const room: RoomEntity = this.roomsService.roomsList[message.roomId];

    return message.content === room.round.keyword;
  }
}
