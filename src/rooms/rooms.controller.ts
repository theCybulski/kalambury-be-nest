import { Controller, Get, Param, Post } from '@nestjs/common';

import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {
  }

  @Get('/players')
  getPlayers() {
    return this.roomsService.getPlayers();
  }

  @Get('/players/:id')
  getPlayerById(
    @Param('id') playerId: string,
  ) {
    return this.roomsService.getPlayerById(playerId);
  }

  @Get()
  getRooms() {
    return this.roomsService.getRooms();
  }

  @Get('/:id')
  getRoomById(
    @Param('id') roomId: string,
  ) {
    return this.roomsService.getRoomById(roomId);
  }

  @Post()
  createRoom() {
    return this.roomsService.createRoom();
  }
}
