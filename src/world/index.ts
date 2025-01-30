import { Managers } from "./managers/Managers";

export class World {
  instance = Managers.Instance;

  async clear() {
    await Managers.Clear();
  }
}
