import { Module } from '@nestjs/common';

import { ChatGateway } from './chat.gateway';
import { RoomsModule } from '../rooms/rooms.module';

@Module({
  imports: [RoomsModule],
  controllers: [],
  providers: [ChatGateway],
})
export class ChatModule {
}
