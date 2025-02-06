import { WorldManager } from "./WorldManager";
import { ResourceManager } from "./ResourceManager";
import { PlayerManager } from "./PlayerManager";
import { WorldServerManager } from "./WorldServerManager";
import { EventServerManager } from "./EventServerManager";
import { GallerySpotManager } from "./GallerySpotManager";

export interface IManager {
  Init(): Promise<void>;
  Dispose(): Promise<void>;
}

export class Managers {
  private static s_instance: Managers;
  static get Instance(): Managers {
    this.Init();
    return this.s_instance;
  }

  _world: WorldManager = new WorldManager();
  _resource: ResourceManager = new ResourceManager();
  _gallerySpot: GallerySpotManager = new GallerySpotManager();
  _players: PlayerManager = new PlayerManager();
  _worldServer: WorldServerManager = new WorldServerManager();
  _eventServer: EventServerManager = new EventServerManager();

  static get World(): WorldManager {
    return Managers.Instance._world;
  }
  static get Resource(): ResourceManager {
    return Managers.Instance._resource;
  }
  static get GallerySpot(): GallerySpotManager {
    return Managers.Instance._gallerySpot;
  }
  static get Players(): PlayerManager {
    return Managers.Instance._players;
  }
  static get WorldServer(): WorldServerManager {
    return Managers.Instance._worldServer;
  }
  static get EventServer(): EventServerManager {
    return Managers.Instance._eventServer;
  }

  static async Init() {
    if (!this.s_instance) {
      this.s_instance = new Managers();

      await this.s_instance._world.Init();
      await this.s_instance._resource.Init();
      await this.s_instance._gallerySpot.Init();
      await this.s_instance._players.Init();
      await this.s_instance._worldServer.Init();
      await this.s_instance._eventServer.Init();
    }
  }

  public static async Clear() {
    if (this.s_instance) {
      await this.s_instance._world.Dispose();
      await this.s_instance._resource.Dispose();
      await this.s_instance._gallerySpot.Dispose();
      await this.s_instance._players.Dispose();
      await this.s_instance._worldServer.Dispose();
      await this.s_instance._eventServer.Dispose();
    }
  }
}
