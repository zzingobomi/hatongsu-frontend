import { MyCharacter } from "../core/characters/MyCharacter";
import { RemoteCharacter } from "../core/characters/RemoteCharacter";
import { Entity } from "../core/engine/Entity";
import { PLAYER_NAME } from "../data/const";
import { IWSAnimationData, IWSTransform } from "../shared/worldserver.type";
import { IManager } from "./Managers";

export interface PlayerInfo {
  sessionId: string;
  isMine: boolean;
  character: Entity;
}

export class PlayerManager implements IManager {
  players: PlayerInfo[] = [];
  myPlayer: PlayerInfo;

  public async Init() {}

  public async Dispose() {
    this.players.forEach((player) => {
      player.character.Dispose();
    });
    this.players = [];
  }

  public async CreateMyPlayer(sessionId: string, transform: IWSTransform) {
    const myCharacter = new MyCharacter(PLAYER_NAME);
    myCharacter.InitMesh();
    myCharacter.InitTransform(transform);

    const info: PlayerInfo = {
      sessionId,
      isMine: true,
      character: myCharacter,
    };
    this.players.push(info);
    this.myPlayer = info;
  }

  public async CreateRemotePlayer(sessionId: string, transform: IWSTransform) {
    const remoteCharacter = new RemoteCharacter(PLAYER_NAME);
    remoteCharacter.InitMesh();
    remoteCharacter.InitTransform(transform);

    const info: PlayerInfo = {
      sessionId,
      isMine: false,
      character: remoteCharacter,
    };
    this.players.push(info);
  }

  public RemovePlayer(sessionId: string) {
    const removeIndex = this.players.findIndex(
      (player) => player.sessionId === sessionId
    );
    if (removeIndex !== -1) {
      this.players[removeIndex].character.Dispose();
      this.players.splice(removeIndex, 1);
    }
  }

  public UpdateRemotePlayerTransform(
    playerId: string,
    transform: IWSTransform
  ) {
    const player = this.players.find((p) => p.sessionId === playerId);
    if (player && !player.isMine) {
      const remoteChar = player.character as RemoteCharacter;
      remoteChar.ApplyNetworkTransform(transform);
    }
  }

  public UpdateRemotePlayerAnimation(playerId: string, data: IWSAnimationData) {
    const player = this.players.find((p) => p.sessionId === playerId);
    if (player && !player.isMine) {
      const remoteChar = player.character as RemoteCharacter;
      remoteChar.ApplyNetworkAnimation(data);
    }
  }
}
