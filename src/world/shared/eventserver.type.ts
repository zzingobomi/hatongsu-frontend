export const ESGalleryRoomName = "gallery_room";

export enum ESMessageType {
  // Server -> Client
  SERVER_CHAT_MESSAGE = "serverChatMessage",

  // Client -> Server
  CLIENT_CHAT_MESSAGE = "clientChatMessage",
}

export interface ESJoinOptions {
  nickname: string;
}

export interface ESChatMessage {
  sessionId: string;
  nickname: string;
  message: string;
  timestamp: number;
}
