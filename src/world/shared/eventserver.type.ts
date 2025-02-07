export const ESGalleryRoomName = "gallery_room";

export enum ESMessageType {
  // Server -> Client
  SERVER_CHAT_MESSAGE = "serverChatMessage",

  // Client -> Server
  CLIENT_CHAT_MESSAGE = "clientChatMessage",
}

export interface ESJoinOptions {
  playerId: string;
  nickname: string;
}

export interface ESChatMessage {
  sessionId: string;
  playerId: string;
  nickname: string;
  message: string;
  timestamp: number;
}
