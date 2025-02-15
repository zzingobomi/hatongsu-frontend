import { AbstractMesh, Quaternion, Ray, Vector3 } from "@babylonjs/core";
import { InputController } from "../engine/InputController";
import { Managers } from "@/world/managers/Managers";
import {
  CharacterState,
  IWSAnimationData,
  IWSTransform,
} from "@/world/shared/worldserver.type";
import { fromBabylonQuaternion, fromBabylonVector3 } from "@/world/utils/Utils";
import { CharacterEntity } from "./CharacterEntity";

export class MyCharacter extends CharacterEntity {
  private static readonly CLAMPED_X: number = 110;
  private static readonly CLAMPED_Z: number = 110;

  private static readonly GRAVITY: number = -2.8;
  private static readonly JUMP_FORCE: number = 0.8;

  private inputController: InputController;

  private moveDirection: Vector3 = new Vector3();
  private inputAmt: number;

  private gravity: Vector3 = new Vector3();
  private lastGroundPos: Vector3 = Vector3.Zero();
  private grounded: boolean;
  private jumpCount: number = 1;

  private moveSpeed = 5;
  private rotateSpeed = 5;

  // WorldSerer
  private lastSentPosition: Vector3 = Vector3.Zero();
  private lastSentRotation: Quaternion = Quaternion.Identity();
  private lastAnimationState: CharacterState = CharacterState.IDLE;
  private readonly NETWORK_UPDATE_THRESHOLD = 0.01;
  private readonly NETWORK_UPDATE_INTERVAL = 100;
  private lastNetworkUpdateTime: number = 0;

  constructor(assetName: string) {
    super(assetName);

    this.inputController = new InputController();
    this.scene.registerBeforeRender(this.update.bind(this));
  }

  protected update() {
    this.deltaTime = this.engine.getDeltaTime() / 1000;
    this.setState(CharacterState.IDLE);

    this.inputController.UpdateInput();

    this.updateFromControls();
    this.updateGroundDetection();

    this.inputController.UpdateCamera(this.rootMesh.position);

    this.switchAnimation(this.currentState);

    this.sendNetworkUpdate();
    this.sendAnimationUpdate();
  }

  private updateFromControls() {
    this.moveDirection = Vector3.Zero();

    const fwd = Managers.World.playerCamera.camRoot.forward;
    const right = Managers.World.playerCamera.camRoot.right;
    const correctedVertical = fwd.scaleInPlace(this.inputController.vertical);
    const correctedHorizontal = right.scaleInPlace(
      this.inputController.horizontal
    );

    const move = correctedHorizontal.addInPlace(correctedVertical);

    this.moveDirection = new Vector3(move.normalize().x, 0, move.normalize().z);

    const inputMag =
      Math.abs(this.inputController.horizontal) +
      Math.abs(this.inputController.vertical);
    if (inputMag < 0) {
      this.inputAmt = 0;
    } else if (inputMag > 1) {
      this.inputAmt = 1;
    } else {
      this.inputAmt = inputMag;
    }

    this.moveDirection = this.moveDirection.scaleInPlace(
      this.inputAmt * this.moveSpeed * this.deltaTime
    );

    const input = new Vector3(
      this.inputController.horizontalAxis,
      0,
      this.inputController.verticalAxis
    );
    if (input.length() === 0) {
      this.setState(CharacterState.IDLE);
      return;
    }

    this.setState(CharacterState.RUNNING);

    let angle = Math.atan2(
      this.inputController.horizontalAxis,
      this.inputController.verticalAxis
    );
    angle += Managers.World.playerCamera.camRoot.rotation.y;
    const targ = Quaternion.FromEulerAngles(0, angle, 0);
    if (this.rootMesh.rotationQuaternion) {
      this.rootMesh.rotationQuaternion = Quaternion.Slerp(
        this.rootMesh.rotationQuaternion,
        targ,
        this.rotateSpeed * this.deltaTime
      );
    }
  }

  private updateGroundDetection() {
    if (!this.isGrounded()) {
      if (this.checkSlope() && this.gravity.y <= 0) {
        this.gravity.y = 0;
        this.jumpCount = 1;
        this.grounded = true;
      } else {
        this.gravity = this.gravity.addInPlace(
          Vector3.Up().scale(this.deltaTime * MyCharacter.GRAVITY)
        );
        this.grounded = false;
      }
    }

    if (this.gravity.y < -MyCharacter.JUMP_FORCE) {
      this.gravity.y = -MyCharacter.JUMP_FORCE;
    }

    this.rootMesh.moveWithCollisions(
      this.moveDirection.addInPlace(this.gravity)
    );

    const clampedX = Math.max(
      -MyCharacter.CLAMPED_X,
      Math.min(MyCharacter.CLAMPED_X, this.rootMesh.position.x)
    );
    const clampedZ = Math.max(
      -MyCharacter.CLAMPED_Z,
      Math.min(MyCharacter.CLAMPED_Z, this.rootMesh.position.z)
    );

    this.rootMesh.position.set(clampedX, this.rootMesh.position.y, clampedZ);

    if (this.isGrounded()) {
      this.gravity.y = 0;
      this.grounded = true;
      this.lastGroundPos.copyFrom(this.rootMesh.position);

      this.jumpCount = 1;
    }

    if (this.inputController.jumpKeyDown && this.jumpCount > 0) {
      this.gravity.y = MyCharacter.JUMP_FORCE;
      this.jumpCount--;

      this.forceNetworkUpdate();
    }
  }

  private isGrounded() {
    if (this.floorRaycast(0, 0, 0.6).equals(Vector3.Zero())) {
      return false;
    } else {
      return true;
    }
  }

  private floorRaycast(offsetx: number, offsetz: number, raycastlen: number) {
    const raycastFloorPos = new Vector3(
      this.rootMesh.position.x + offsetx,
      this.rootMesh.position.y + 0.5,
      this.rootMesh.position.z + offsetz
    );
    const ray = new Ray(raycastFloorPos, Vector3.Up().scale(-1), raycastlen);

    const predicate = (mesh: AbstractMesh) => {
      return mesh.isPickable && mesh.isEnabled();
    };

    const pick = this.scene.pickWithRay(ray, predicate);

    if (pick && pick.pickedPoint) {
      return pick.pickedPoint;
    } else {
      return Vector3.Zero();
    }
  }

  private checkSlope() {
    const predicate = (mesh: AbstractMesh) => {
      return mesh.isPickable && mesh.isEnabled();
    };

    // 4 raycasts outward from center
    const raycast = new Vector3(
      this.mesh.position.x,
      this.mesh.position.y + 0.5,
      this.mesh.position.z + 0.25
    );
    const ray = new Ray(raycast, Vector3.Up().scale(-1), 1.5);
    const pick = this.scene.pickWithRay(ray, predicate);

    const raycast2 = new Vector3(
      this.mesh.position.x,
      this.mesh.position.y + 0.5,
      this.mesh.position.z - 0.25
    );
    const ray2 = new Ray(raycast2, Vector3.Up().scale(-1), 1.5);
    const pick2 = this.scene.pickWithRay(ray2, predicate);

    const raycast3 = new Vector3(
      this.mesh.position.x + 0.25,
      this.mesh.position.y + 0.5,
      this.mesh.position.z
    );
    const ray3 = new Ray(raycast3, Vector3.Up().scale(-1), 1.5);
    const pick3 = this.scene.pickWithRay(ray3, predicate);

    const raycast4 = new Vector3(
      this.mesh.position.x - 0.25,
      this.mesh.position.y + 0.5,
      this.mesh.position.z
    );
    const ray4 = new Ray(raycast4, Vector3.Up().scale(-1), 1.5);
    const pick4 = this.scene.pickWithRay(ray4, predicate);

    if (pick && pick.pickedMesh && !pick.getNormal()?.equals(Vector3.Up())) {
      if (pick.pickedMesh.name.includes("stair")) {
        return true;
      }
    } else if (
      pick2 &&
      pick2.pickedMesh &&
      !pick2.getNormal()?.equals(Vector3.Up())
    ) {
      if (pick2.pickedMesh.name.includes("stair")) {
        return true;
      }
    } else if (
      pick3 &&
      pick3.pickedMesh &&
      !pick3.getNormal()?.equals(Vector3.Up())
    ) {
      if (pick3.pickedMesh.name.includes("stair")) {
        return true;
      }
    } else if (
      pick4 &&
      pick4.pickedMesh &&
      !pick4.getNormal()?.equals(Vector3.Up())
    ) {
      if (pick4.pickedMesh.name.includes("stair")) {
        return true;
      }
    }
    return false;
  }

  private sendNetworkUpdate() {
    const currentTime = Date.now();
    const positionChanged =
      Vector3.DistanceSquared(this.rootMesh.position, this.lastSentPosition) >
      this.NETWORK_UPDATE_THRESHOLD ** 2;

    const rotationChanged =
      this.rootMesh.rotationQuaternion &&
      !this.rootMesh.rotationQuaternion.equalsWithEpsilon(
        this.lastSentRotation,
        this.NETWORK_UPDATE_THRESHOLD
      );

    if (
      (positionChanged || rotationChanged) &&
      currentTime - this.lastNetworkUpdateTime > this.NETWORK_UPDATE_INTERVAL
    ) {
      const playerTransform: IWSTransform = {
        position: fromBabylonVector3(this.rootMesh.position),
        rotation: fromBabylonQuaternion(
          this.rootMesh.rotationQuaternion || Quaternion.Identity()
        ),
      };

      Managers.WorldServer.SendPlayerUpdate(playerTransform);

      this.lastSentPosition.copyFrom(this.rootMesh.position);
      if (this.rootMesh.rotationQuaternion) {
        this.lastSentRotation.copyFrom(this.rootMesh.rotationQuaternion);
      }
      this.lastNetworkUpdateTime = currentTime;
    }
  }

  private sendAnimationUpdate() {
    if (this.currentState !== this.lastAnimationState) {
      const animationData: IWSAnimationData = {
        playerId: Managers.WorldServer.GetPlayerId(),
        state: this.currentState,
      };

      Managers.WorldServer.SendPlayerAnimation(animationData);
      this.lastAnimationState = this.currentState;
    }
  }

  private forceNetworkUpdate() {
    this.lastNetworkUpdateTime = 0;
    this.sendNetworkUpdate();
    this.sendAnimationUpdate();
  }
}
