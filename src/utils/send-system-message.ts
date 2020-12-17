import { Server } from 'socket.io';

import { wsEvents } from '../constants/wsEvents';
import { MessageInterface } from '../chat/message.interface';

export const sendSystemMessage = (wss: Server, roomId, content: string) => {
  const message: MessageInterface = {
    content,
    senderId: 'system',
    senderName: 'System',
    roomId,
  };
  wss.to(roomId).emit(wsEvents.toClient.chat.toClient, { ...message, isCorrect: false });
};
