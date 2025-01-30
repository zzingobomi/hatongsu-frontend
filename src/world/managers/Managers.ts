import { WorldManager } from "./WorldManager";
import { ResourceManager } from "./ResourceManager";

export class Managers {
  private static s_instance: Managers;
  static get Instance(): Managers {
    this.Init();
    return this.s_instance;
  }

  _world: WorldManager = new WorldManager();
  _resource: ResourceManager = new ResourceManager();

  static get World(): WorldManager {
    return Managers.Instance._world;
  }
  static get Resource(): ResourceManager {
    return Managers.Instance._resource;
  }

  static async Init() {
    if (!this.s_instance) {
      this.s_instance = new Managers();

      await this.s_instance._world.Init();
    }
  }

  public static async Clear() {}
}
