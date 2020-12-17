export const wsEvents = {
  toServer: {
    joinRoom: 'joinRoom',
    leaveRoom: 'leaveRoom',
    round: {
      updatePlayers: 'updatePlayersToServer',
      updateSettings: 'updateSettingsToServer',
      updateRound: 'updateRoundToServer',
      flipchart: 'flipchartToServer',
      start: 'startRoundToServer',
    },
    chat: {
      toServer: 'chatToServer',
    },
  },
  toClient: {
    serverError: 'serverError',
    joinedRoom: 'joinedRoom',
    leftRoom: 'leftRoom',
    round: {
      updatePlayers: 'updatePlayersToClient',
      updateSettings: 'updateSettingsToClient',
      updateRound: 'updateRoundToClient',
      flipchart: 'flipchartToClient',
      updateTimer: 'updateTimerToClient',
    },
    chat: {
      toClient: 'chatToClient',
    },
  },
};
