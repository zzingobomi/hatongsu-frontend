import {
  Scene,
  TransformNode,
  UniversalCamera,
  Vector3,
} from "@babylonjs/core";

export class PlayerCamera {
  public camera: UniversalCamera;
  private scene: Scene;
  public camRoot: TransformNode;

  constructor(scene: Scene) {
    this.scene = scene;
    this.init();
  }

  private init() {
    this.camRoot = new TransformNode("root");
    this.camRoot.position = new Vector3(0, 2, 0);
    this.camRoot.rotation = new Vector3(0, 0, 0);

    this.camera = new UniversalCamera("cam", new Vector3(0, 0, 0), this.scene);
    this.camera.fov = 0.7;
    this.camera.parent = this.camRoot;

    this.camera.attachControl();

    this.scene.activeCamera = this.camera;
  }
}
