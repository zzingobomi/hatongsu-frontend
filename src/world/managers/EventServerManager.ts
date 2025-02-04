import * as Colyseus from "colyseus.js";
import {
  ESChatMessage,
  ESGalleryRoomName,
  ESJoinMessage,
  ESLeaveMessage,
  ESMessageType,
} from "../shared/eventserver.type";
import { useChatStore } from "@/app/stores/ChatStore";

export class EventServerManager {
  private client: Colyseus.Client;
  private room: Colyseus.Room;
  private sessionId: string;
  private unsubscribePendingMessage: () => void;

  public async Init() {
    try {
      this.client = new Colyseus.Client(
        `${process.env.NEXT_PUBLIC_EVENT_SERVER_URL}`
      );

      await this.joinToServer();
      this.registerEventHandlers();
      this.subscribeToPendingMessage();
    } catch (error) {
      console.error("Error initializing EventServerManager", error);
    }
  }

  private joinToServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client
        .join(ESGalleryRoomName)
        .then((room) => {
          console.log("joined room", room);
          this.sessionId = room.sessionId;
          this.room = room;
          resolve();
        })
        .catch((error) => {
          console.error("Error joining room", error);
          reject(error);
        });
    });
  }

  public GetSessionId(): string {
    return this.sessionId;
  }

  private sendChatMessage(message: string) {
    this.room.send(ESMessageType.CLIENT_CHAT_MESSAGE, message);
  }

  private registerEventHandlers() {
    this.room.onMessage(
      ESMessageType.SERVER_JOIN_MESSAGE,
      this.handleJoinMessage.bind(this)
    );
    this.room.onMessage(
      ESMessageType.SERVER_LEAVE_MESSAGE,
      this.handleLeaveMessage.bind(this)
    );
    this.room.onMessage(
      ESMessageType.SERVER_CHAT_MESSAGE,
      this.handleChatMessage.bind(this)
    );
  }

  private handleJoinMessage(message: ESJoinMessage) {
    console.log("join message received", message);
  }

  private handleLeaveMessage(message: ESLeaveMessage) {
    console.log("leave message received", message);
  }

  private handleChatMessage(message: ESChatMessage) {
    console.log("Chat message received", message);
    useChatStore.getState().addMessage(message);
  }

  private subscribeToPendingMessage() {
    this.unsubscribePendingMessage = useChatStore.subscribe(
      (state, previousState) => {
        if (
          state.pendingMessage &&
          state.pendingMessage !== previousState.pendingMessage
        ) {
          this.sendChatMessage(state.pendingMessage);
          useChatStore.getState().sendMessage("");
        }
      }
    );
  }
}
