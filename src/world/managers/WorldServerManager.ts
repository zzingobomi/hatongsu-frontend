import geckos, { ClientChannel, Data } from "@geckos.io/client";
import {
  IWSAnimationData,
  IWSPlayerData,
  IWSTransform,
  WSMessageType,
} from "../shared/worldserver.type";
import { IManager, Managers } from "./Managers";

export class WorldServerManager implements IManager {
  private channel: ClientChannel;
  private playerId: string;

  public async Init() {
    try {
      this.channel = geckos({
        url: `${process.env.NEXT_PUBLIC_WORLD_SERVER_URL}`,
        port: parseInt(`${process.env.NEXT_PUBLIC_WORLD_SERVER_PORT}`),
      });

      await this.connectToServer();
      this.registerEventHandlers();
    } catch (error) {
      console.error("Error initializing WorldServerManager", error);
    }
  }

  public async Dispose() {
    this.channel.close();
  }

  private connectToServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.channel.onConnect((error) => {
        if (error) {
          reject(error);
        } else {
          if (this.channel.id) {
            this.playerId = this.channel.id.toString();
          }
          resolve();
        }
      });
    });
  }

  public GetPlayerId(): string {
    return this.playerId;
  }

  public SendPlayerUpdate(data: IWSTransform) {
    this.channel.emit(WSMessageType.CLIENT_PLAYER_UPDATE, { ...data });
  }

  public SendPlayerAnimation(data: IWSAnimationData) {
    this.channel.emit(WSMessageType.CLIENT_ANIMATION_UPDATE, { ...data });
  }

  private registerEventHandlers() {
    window.addEventListener("beforeunload", () => {
      this.channel.close();
    });

    this.channel.on(
      WSMessageType.SERVER_EXISTING_PLAYERS,
      this.handleExistingPlayers.bind(this)
    );
    this.channel.on(
      WSMessageType.SERVER_NEW_PLAYER,
      this.handleNewPlayer.bind(this)
    );
    this.channel.on(
      WSMessageType.SERVER_PLAYER_UPDATE,
      this.handlePlayerUpdate.bind(this)
    );
    this.channel.on(
      WSMessageType.SERVER_PLAYER_ANIMATION,
      this.handlePlayerAnimation.bind(this)
    );
    this.channel.on(
      WSMessageType.SERVER_PLAYER_DISCONNECTED,
      this.handlePlayerDisconnected.bind(this)
    );
  }

  private handleExistingPlayers(data: Data) {
    const players = data as IWSPlayerData[];
    players.forEach((player) => {
      if (player.playerId !== this.channel.id) {
        Managers.Players.CreateRemotePlayer(player.playerId, player.transform);
      }
    });
  }

  private handleNewPlayer(data: Data) {
    const player = data as IWSPlayerData;
    if (player.playerId !== this.channel.id) {
      Managers.Players.CreateRemotePlayer(player.playerId, player.transform);
    } else {
      Managers.Players.CreateMyPlayer(player.playerId, player.transform);
    }
  }

  private handlePlayerUpdate(data: Data) {
    const updateData = data as IWSPlayerData;
    if (updateData.playerId !== this.playerId) {
      Managers.Players.UpdateRemotePlayerTransform(
        updateData.playerId,
        updateData.transform
      );
    }
  }

  private handlePlayerAnimation(data: Data) {
    const animData = data as IWSAnimationData;
    if (animData.playerId !== this.playerId) {
      Managers.Players.UpdateRemotePlayerAnimation(animData.playerId, animData);
    }
  }

  private handlePlayerDisconnected(data: Data) {
    const playerId = data as string;
    Managers.Players.RemovePlayer(playerId);
  }
}
