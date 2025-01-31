export enum WSMessageType {
  // Server -> Client
  SERVER_EXISTING_PLAYERS = "serverExistingPlayers",
  SERVER_NEW_PLAYER = "serverNewPlayer",
  SERVER_PLAYER_UPDATE = "serverPlayerUpdate",
  SERVER_PLAYER_DISCONNECTED = "serverPlayerDisconnected",
  SERVER_PLAYER_ANIMATION = "serverPlayerAnimation",

  // Client -> Server
  CLIENT_PLAYER_UPDATE = "clientPlayerUpdate",
  CLIENT_ANIMATION_UPDATE = "clientAnimationUpdate",
}

export enum CharacterState {
  IDLE,
  WALKING,
  RUNNING,
  JUMP,
}

export interface IWSVector3 {
  x: number;
  y: number;
  z: number;
}

export interface IWSVector4 {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface IWSTransform {
  position: IWSVector3;
  rotation: IWSVector4;
}

export interface IWSAnimationData {
  playerId: string;
  state: CharacterState;
}

export interface IWSPlayerData {
  playerId: string;
  transform: IWSTransform;
}
