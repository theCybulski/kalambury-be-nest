import { Socket } from 'socket.io';

import { wsEvents } from '../constants/wsEvents';

export const socketErrorToClient = (client: Socket, code: number, message: string) => {
  client.emit(wsEvents.toClient.serverError, { code, message });
};
