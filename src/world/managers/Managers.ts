import { WorldManager } from "./WorldManager";
import { ResourceManager } from "./ResourceManager";
import { PlayerManager } from "./PlayerManager";
import { WorldServerManager } from "./WorldServerManager";

export class Managers {
  private static s_instance: Managers;
  static get Instance(): Managers {
    this.Init();
    return this.s_instance;
  }

  _world: WorldManager = new WorldManager();
  _resource: ResourceManager = new ResourceManager();
  _players: PlayerManager = new PlayerManager();
  _worldServer: WorldServerManager = new WorldServerManager();

  static get World(): WorldManager {
    return Managers.Instance._world;
  }
  static get Resource(): ResourceManager {
    return Managers.Instance._resource;
  }
  static get Players(): PlayerManager {
    return Managers.Instance._players;
  }
  static get WorldServer(): WorldServerManager {
    return Managers.Instance._worldServer;
  }

  static async Init() {
    if (!this.s_instance) {
      this.s_instance = new Managers();

      await this.s_instance._world.Init();
      await this.s_instance._worldServer.Init();
    }
  }

  public static async Clear() {}
}
