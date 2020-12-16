import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { RoomsModule } from '../rooms/rooms.module';
import { ChatService } from './chat.service';

@Module({
  imports: [RoomsModule],
  controllers: [],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {
}
