import { Controller, Get, Post } from '@nestjs/common';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {
  }

  @Get('/online-players')
  getOnlinePlayers() {
    return this.roomsService.getPlayers();
  }

  @Get()
  getRoomsList() {
    return this.roomsService.getRoomsList();
  }

  @Post()
  createRoom() {
    return this.roomsService.createRoom();
  }
}
