export enum ESMessageType {
  // Server -> Client
  SERVER_EXISTING_PLAYERS = "serverExistingPlayers",
  SERVER_NEW_PLAYER = "serverNewPlayer",
  SERVER_PLAYER_DISCONNECTED = "serverPlayerDisconnected",
  SERVER_CHAT_MESSAGE = "serverChatMessage",

  // Client -> Server
  CLIENT_CHAT_MESSAGE = "clientChatMessage",
}
