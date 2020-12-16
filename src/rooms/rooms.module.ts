import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { RoomGateway } from './room.gateway';

@Module({
  exports: [RoomsService],
  providers: [RoomsService, RoomGateway],
  controllers: [RoomsController],
})
export class RoomsModule {
}
