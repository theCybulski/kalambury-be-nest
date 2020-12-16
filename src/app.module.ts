import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [RoomsModule, ChatModule],
  // controllers: [PlayersController],
  // providers: [ChatGateway, PlayersService],
})
export class AppModule {
}
