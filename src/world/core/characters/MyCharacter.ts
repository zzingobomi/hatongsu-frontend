import {
  AbstractMesh,
  Color3,
  Matrix,
  Mesh,
  MeshBuilder,
  Quaternion,
  Ray,
  Scalar,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core";
import { Entity } from "../engine/Entity";
import { InputController } from "../engine/InputController";
import { Managers } from "@/world/managers/Managers";

export enum CharacterState {
  IDLE,
  WALKING,
  RUNNING,
  JUMP,
}

export class MyCharacter extends Entity {
  private static readonly GRAVITY: number = -2.8;
  private static readonly JUMP_FORCE: number = 0.8;

  inputController: InputController;

  moveDirection: Vector3 = new Vector3();
  inputAmt: number;

  gravity: Vector3 = new Vector3();
  lastGroundPos: Vector3 = Vector3.Zero();
  grounded: boolean;
  jumpCount: number = 1;

  currentState: CharacterState = CharacterState.IDLE;

  deltaTime: number = 0;
  elapsedTime: number = 0;

  moveSpeed = 10;
  rotateSpeed = 10;

  constructor(assetName: string) {
    super(assetName);

    this.inputController = new InputController();

    this.scene.registerBeforeRender(this.update.bind(this));
  }

  InitMesh() {
    const outer = MeshBuilder.CreateBox(
      "myCharacter",
      { width: 2, depth: 1, height: 3 },
      this.scene
    );
    outer.isVisible = false;
    outer.isPickable = false;
    outer.checkCollisions = true;

    // Debug
    // const material = new StandardMaterial("charMaterial", this.scene);
    // material.alpha = 0.3;
    // material.diffuseColor = new Color3(0.5, 0.5, 1);
    // material.emissiveColor = new Color3(0.2, 0.2, 0.5);
    // material.backFaceCulling = false;

    // outer.material = material;

    outer.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0));

    outer.ellipsoid = new Vector3(1, 1.5, 1);
    outer.ellipsoidOffset = new Vector3(0, 1.5, 0);

    outer.rotationQuaternion = new Quaternion(0, 1, 0, 0);

    this.rootMesh = outer;
    this.rootMesh.parent = this;

    const mesh = this.rootNodes[0] as AbstractMesh;
    mesh.parent = this.rootMesh;
    mesh.isPickable = false;
    mesh.getChildMeshes().forEach((m) => {
      m.isPickable = false;
    });

    this.mesh = mesh;

    for (const animationGroup of this.animationGroups) {
      animationGroup.play(true);
    }
    this.animationGroups[CharacterState.IDLE].weight = 1.0;
    this.animationGroups[CharacterState.WALKING].weight = 0.0;
    this.animationGroups[CharacterState.RUNNING].weight = 0.0;
    this.animationGroups[CharacterState.JUMP].weight = 0.0;
  }

  private setState(state: CharacterState) {
    this.currentState = state;
  }

  private update() {
    this.deltaTime = this.engine.getDeltaTime();
    this.setState(CharacterState.IDLE);

    this.inputController.UpdateInput();

    this.updateFromControls();
    this.updateGroundDetection();

    this.inputController.UpdateCamera(this.rootMesh.position);

    this.switchAnimation(this.currentState);
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
      this.inputAmt * this.moveSpeed * (this.deltaTime / 1000)
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
        this.rotateSpeed * (this.deltaTime / 1000.0)
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
          Vector3.Up().scale((this.deltaTime / 1000.0) * MyCharacter.GRAVITY)
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

    if (this.isGrounded()) {
      this.gravity.y = 0;
      this.grounded = true;
      this.lastGroundPos.copyFrom(this.rootMesh.position);

      this.jumpCount = 1;
    }

    if (this.inputController.jumpKeyDown && this.jumpCount > 0) {
      this.gravity.y = MyCharacter.JUMP_FORCE;
      this.jumpCount--;
    }
  }

  private switchAnimation(state: CharacterState) {
    for (let i = 0; i < this.animationGroups.length; i++) {
      if (state === i) {
        this.animationGroups[i].weight += 0.005 * this.deltaTime;
      } else {
        this.animationGroups[i].weight -= 0.005 * this.deltaTime;
      }
      this.animationGroups[i].weight = Scalar.Clamp(
        this.animationGroups[i].weight,
        0.0,
        1.0
      );
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
}
