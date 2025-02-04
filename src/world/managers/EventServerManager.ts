import * as Colyseus from "colyseus.js";
import { ESMessageType } from "../shared/eventserver.type";

export class EventServerManager {
  private client: Colyseus.Client;
  private room: Colyseus.Room;
  private sessionId: string;

  public async Init() {
    try {
      this.client = new Colyseus.Client(
        `${process.env.NEXT_PUBLIC_EVENT_SERVER_URL}`
      );

      await this.joinToServer();
      this.registerEventHandlers();
    } catch (error) {
      console.error("Error initializing EventServerManager", error);
    }
  }

  private joinToServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client
        .join("gallery_room")
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

  public SendChatMessage(message: string) {
    this.room.send(ESMessageType.CLIENT_CHAT_MESSAGE, message);
  }

  private registerEventHandlers() {
    this.room.onMessage(
      ESMessageType.SERVER_CHAT_MESSAGE,
      this.handleChatMessage.bind(this)
    );
  }

  private handleChatMessage(message: string) {
    console.log("Chat message received", message);
  }
}
