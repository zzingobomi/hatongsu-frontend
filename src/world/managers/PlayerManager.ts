import { MyCharacter } from "../core/characters/MyCharacter";
import { Entity } from "../core/engine/Entity";
import { PLAYER_NAME } from "../data/resources";

export interface PlayerInfo {
  isMine: boolean;
  character: Entity;
}

export class PlayerManager {
  players: PlayerInfo[] = [];
  myPlayer: PlayerInfo;

  public async CreateMyPlayer() {
    const myCharacter = new MyCharacter(PLAYER_NAME);
    myCharacter.InitMesh();
  }
}
