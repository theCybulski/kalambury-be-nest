import { Socket } from 'socket.io';
import { wsEvents } from '../shared/constants';

export const socketErrorToClient = (client: Socket, code: number, message: string) => {
  client.emit(wsEvents.toClient.serverError, { code, message });
};
