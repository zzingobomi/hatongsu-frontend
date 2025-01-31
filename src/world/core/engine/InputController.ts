import {
  DeviceSource,
  DeviceSourceManager,
  DeviceType,
  Engine,
  Scene,
  Tools,
  Vector3,
  Scalar,
  IPointerEvent,
  PickingInfo,
  PointerEventTypes,
} from "@babylonjs/core";
import { PlayerCamera } from "./PlayerCamera";
import { Managers } from "@/world/managers/Managers";
import { moveTowardsVector3 } from "@/world/utils/Utils";

export enum KeyboardCode {
  KEY_W = 87,
  KEY_S = 83,
  KEY_A = 65,
  KEY_D = 68,
  KEY_SHIFT = 16,
  KEY_SPACE = 32,
}

export class InputController {
  private static readonly MOUSE_SENSITIVITY: number = 0.006;
  private static readonly CAMERA_ROTATION_SPEED: number = 0.05;
  private static readonly MOUSE_Y_MIN: number = -35;
  private static readonly MOUSE_Y_MAX: number = 45;

  engine: Engine;
  scene: Scene;
  playerCamera: PlayerCamera;

  dsm: DeviceSourceManager;

  horizontal: number = 0;
  vertical: number = 0;

  horizontalAxis: number = 0;
  verticalAxis: number = 0;

  jumpKeyDown: boolean = false;
  runKeyDown: boolean = false;

  mouseX: number = 0;
  mouseY: number = 0;

  deltaTime: number;

  keyboard: DeviceSource<DeviceType.Keyboard>;
  mouse: DeviceSource<DeviceType.Mouse>;

  constructor() {
    this.engine = Managers.World.engine;
    this.scene = Managers.World.scene;
    this.playerCamera = Managers.World.playerCamera;

    this.dsm = new DeviceSourceManager(this.engine);

    this.scene.onPointerMove = this.mouseMove.bind(this);
  }

  UpdateInput() {
    this.deltaTime = this.engine.getDeltaTime();
    const keyboardSource = this.dsm.getDeviceSource(DeviceType.Keyboard);
    const mouseSource = this.dsm.getDeviceSource(DeviceType.Mouse);

    if (keyboardSource) {
      this.keyboard = keyboardSource;
    }

    if (mouseSource) {
      this.mouse = mouseSource;
    }

    this.updateFromKeyboard();
  }

  UpdateCamera(targetPosition: Vector3) {
    const centerPlayer = targetPosition.y + 2;
    this.playerCamera.camRoot.position = Vector3.Lerp(
      this.playerCamera.camRoot.position,
      new Vector3(targetPosition.x, centerPlayer, targetPosition.z),
      0.4
    );

    this.playerCamera.camRoot.rotation = moveTowardsVector3(
      this.playerCamera.camRoot.rotation,
      new Vector3(
        Tools.ToRadians(this.mouseY),
        Tools.ToRadians(this.mouseX),
        0
      ),
      InputController.CAMERA_ROTATION_SPEED * this.deltaTime
    );
  }

  private updateFromKeyboard() {
    if (this.keyboard) {
      if (this.keyboard.getInput(KeyboardCode.KEY_W)) {
        this.vertical = Scalar.Lerp(this.vertical, 1, 0.2);
        this.verticalAxis = 1;
      } else if (this.keyboard.getInput(KeyboardCode.KEY_S)) {
        this.vertical = Scalar.Lerp(this.vertical, -1, 0.2);
        this.verticalAxis = -1;
      } else {
        this.vertical = 0;
        this.verticalAxis = 0;
      }

      if (this.keyboard.getInput(KeyboardCode.KEY_A)) {
        this.horizontal = Scalar.Lerp(this.horizontal, -1, 0.2);
        this.horizontalAxis = -1;
      } else if (this.keyboard.getInput(KeyboardCode.KEY_D)) {
        this.horizontal = Scalar.Lerp(this.horizontal, 1, 0.2);
        this.horizontalAxis = 1;
      } else {
        this.horizontal = 0;
        this.horizontalAxis = 0;
      }

      if (this.keyboard.getInput(KeyboardCode.KEY_SHIFT)) {
        this.runKeyDown = true;
      } else {
        this.runKeyDown = false;
      }

      if (this.keyboard.getInput(KeyboardCode.KEY_SPACE)) {
        this.jumpKeyDown = true;
      } else {
        this.jumpKeyDown = false;
      }
    }
  }

  private mouseMove(
    evt: IPointerEvent,
    pickInfo: PickingInfo,
    type: PointerEventTypes
  ) {
    if (document.pointerLockElement === Managers.World.canvas) {
      const deltaTime = this.engine.getDeltaTime();

      this.mouseX +=
        evt.movementX * InputController.MOUSE_SENSITIVITY * deltaTime;
      this.mouseY +=
        evt.movementY * InputController.MOUSE_SENSITIVITY * deltaTime;
      this.mouseY = Scalar.Clamp(
        this.mouseY,
        InputController.MOUSE_Y_MIN,
        InputController.MOUSE_Y_MAX
      );
    }
  }
}
