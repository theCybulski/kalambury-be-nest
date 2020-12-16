export const wsEvents = {
  toServer: {
    joinRoom: "joinRoom",
    leaveRoom: "leaveRoom",
    round: {
      updatePlayers: "updatePlayersToServer",
      updateSettings: "updateSettingsToServer",
      updateRound: "updateRoundToServer",
      flipchart: "flipchartToServer"
    },
    chat: {
      toServer: "chatToServer"
    }
  },
  toClient: {
    serverError: "serverError",
    joinedRoom: "joinedRoom",
    leftRoom: "leftRoom",
    round: {
      updatePlayers: "updatePlayersToClient",
      updateSettings: "updateSettingsToClient",
      updateRound: "updateRoundToClient",
      flipchart: "flipchartToClient"
    },
    chat: {
      toClient: "chatToClient"
    }
  }
};
