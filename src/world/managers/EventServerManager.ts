import * as Colyseus from "colyseus.js";
import {
  ESChatMessage,
  ESGalleryRoomName,
  ESJoinOptions,
  ESMessageType,
} from "../shared/eventserver.type";
import { useChatStore } from "@/app/stores/ChatStore";
import { PlayerSchema } from "../schema/PlayerSchema";
import { GalleryRoomState } from "../schema/GalleryRoomState";
import { SERVER_NICKNAME } from "../data/const";
import { IManager, Managers } from "./Managers";

export class EventServerManager implements IManager {
  private client: Colyseus.Client;
  private room: Colyseus.Room<GalleryRoomState>;
  private sessionId: string;
  private unsubscribeMyChatMessage: () => void;

  public async Init() {
    try {
      this.client = new Colyseus.Client(
        `${process.env.NEXT_PUBLIC_EVENT_SERVER_URL}`
      );

      await this.joinToServer();
      this.registerEventHandlers();
      this.subscribeMyChatMessage();
    } catch (error) {
      console.error("Error initializing EventServerManager", error);
    }
  }

  public async Dispose() {
    this.unsubscribeMyChatMessage();
    await this.room.leave();
  }

  private joinToServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      const nickname = localStorage.getItem("nickname");
      if (!nickname) {
        reject("Nickname is not set");
        return;
      }
      const playerId = Managers.WorldServer.GetPlayerId();
      const options: ESJoinOptions = { playerId, nickname };

      this.client
        .join(ESGalleryRoomName, options)
        .then((room) => {
          console.log("joined room", room);
          this.sessionId = room.sessionId;
          this.room = room as Colyseus.Room<GalleryRoomState>;
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
      ESMessageType.SERVER_CHAT_MESSAGE,
      this.handleChatMessage.bind(this)
    );

    this.room.state.players.onAdd((player: PlayerSchema, sessionId: string) => {
      if (sessionId !== this.sessionId) {
        const remotePlayer = Managers.Players.GetPlayer(player.playerId);
        if (remotePlayer) {
          remotePlayer.character.CreateNicknameBillboard(player.nickname);
        }

        useChatStore.getState().addMessage({
          sessionId,
          playerId: Managers.WorldServer.GetPlayerId(),
          nickname: SERVER_NICKNAME,
          message: `${player.nickname} 님이 갤러리에 입장하셨습니다.`,
          timestamp: Date.now(),
          isMine: false,
        });
      }
    });

    this.room.state.players.onRemove(
      (player: PlayerSchema, sessionId: string) => {
        if (sessionId !== this.sessionId) {
          useChatStore.getState().addMessage({
            sessionId,
            playerId: Managers.WorldServer.GetPlayerId(),
            nickname: SERVER_NICKNAME,
            message: `${player.nickname} 님이 갤러리를 떠나셨습니다.`,
            timestamp: Date.now(),
            isMine: false,
          });
        }
      }
    );
  }

  private handleChatMessage(message: ESChatMessage) {
    console.log("Chat message received", message);
    const isMine = message.sessionId === this.sessionId;
    useChatStore.getState().addMessage({ ...message, isMine });

    if (!isMine) {
      const remotePlayer = Managers.Players.GetPlayer(message.playerId);
      if (remotePlayer) {
        remotePlayer.character.ShowChattingMessage(message.message);
      }
    } else {
      const myPlayer = Managers.Players.GetPlayer(message.playerId);
      if (myPlayer) {
        myPlayer.character.ShowChattingMessage(message.message);
      }
    }
  }

  private subscribeMyChatMessage() {
    this.unsubscribeMyChatMessage = useChatStore.subscribe(
      (state, previousState) => {
        if (
          state.myChatMessage &&
          state.myChatMessage !== previousState.myChatMessage
        ) {
          this.sendChatMessage(state.myChatMessage);
          useChatStore.getState().sendMessage("");
        }
      }
    );
  }
}
