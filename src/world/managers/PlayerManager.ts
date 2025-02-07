import { CharacterEntity } from "../core/characters/CharacterEntity";
import { MyCharacter } from "../core/characters/MyCharacter";
import { RemoteCharacter } from "../core/characters/RemoteCharacter";
import { PLAYER_NAME } from "../data/const";
import { IWSAnimationData, IWSTransform } from "../shared/worldserver.type";
import { IManager } from "./Managers";

export interface PlayerInfo {
  playerId: string;
  isMine: boolean;
  character: CharacterEntity;
}

export class PlayerManager implements IManager {
  players = new Map<string, PlayerInfo>();
  myPlayer: PlayerInfo;

  public async Init() {}

  public async Dispose() {
    this.players.forEach((player) => {
      player.character.Dispose();
    });
    this.players.clear();
  }

  public GetPlayer(playerId: string) {
    return this.players.get(playerId);
  }

  public async CreateMyPlayer(playerId: string, transform: IWSTransform) {
    const myCharacter = new MyCharacter(PLAYER_NAME);
    myCharacter.InitMesh();
    myCharacter.InitTransform(transform);

    const nickname = localStorage.getItem("nickname") || "Player";
    myCharacter.CreateNicknameBillboard(nickname);

    const info: PlayerInfo = {
      playerId,
      isMine: true,
      character: myCharacter,
    };
    this.players.set(playerId, info);
    this.myPlayer = info;
  }

  public async CreateRemotePlayer(playerId: string, transform: IWSTransform) {
    const remoteCharacter = new RemoteCharacter(PLAYER_NAME);
    remoteCharacter.InitMesh();
    remoteCharacter.InitTransform(transform);

    const info: PlayerInfo = {
      playerId,
      isMine: false,
      character: remoteCharacter,
    };
    this.players.set(playerId, info);
  }

  public RemovePlayer(playerId: string): void {
    const player = this.players.get(playerId);
    if (player) {
      player.character.Dispose();
      this.players.delete(playerId);
    }
  }

  public UpdateRemotePlayerTransform(
    playerId: string,
    transform: IWSTransform
  ) {
    const player = this.players.get(playerId);
    if (player && !player.isMine) {
      const remoteChar = player.character as RemoteCharacter;
      remoteChar.ApplyNetworkTransform(transform);
    }
  }

  public UpdateRemotePlayerAnimation(playerId: string, data: IWSAnimationData) {
    const player = this.players.get(playerId);
    if (player && !player.isMine) {
      const remoteChar = player.character as RemoteCharacter;
      remoteChar.ApplyNetworkAnimation(data);
    }
  }
}
