export const ESGalleryRoomName = "gallery_room";

export enum ESMessageType {
  // Server -> Client
  SERVER_JOIN_MESSAGE = "serverJoinMessage",
  SERVER_LEAVE_MESSAGE = "serverLeaveMessage",
  SERVER_CHAT_MESSAGE = "serverChatMessage",

  // Client -> Server
  CLIENT_CHAT_MESSAGE = "clientChatMessage",
}

export interface ESJoinMessage {
  sessionId: string;
}

export interface ESLeaveMessage {
  sessionId: string;
}

export interface ESChatMessage {
  sessionId: string;
  message: string;
}
