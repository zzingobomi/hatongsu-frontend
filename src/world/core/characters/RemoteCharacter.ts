import { Quaternion, Vector3 } from "@babylonjs/core";
import {
  IWSAnimationData,
  IWSTransform,
} from "@/world/shared/worldserver.type";
import { toBabylonQuaternion, toBabylonVector3 } from "@/world/utils/Utils";
import { CharacterEntity } from "./CharacterEntity";

export class RemoteCharacter extends CharacterEntity {
  private POSITION_LERP_SPEED: number = 8;
  private ROTATION_LERP_SPEED: number = 5;

  private targetPosition: Vector3 = Vector3.Zero();
  private targetRotation: Quaternion = Quaternion.Identity();

  public InitTransform(transform: IWSTransform) {
    const initialPosition = toBabylonVector3(transform.position);
    const initialRotation = toBabylonQuaternion(transform.rotation);

    this.rootMesh.position = initialPosition;
    this.rootMesh.rotationQuaternion = initialRotation;

    this.targetPosition = initialPosition.clone();
    this.targetRotation = initialRotation.clone();
  }

  public ApplyNetworkTransform(data: IWSTransform) {
    this.targetPosition = toBabylonVector3(data.position);
    this.targetRotation = toBabylonQuaternion(data.rotation);
  }

  public ApplyNetworkAnimation(data: IWSAnimationData) {
    this.setState(data.state);
  }

  protected update() {
    this.deltaTime = this.engine.getDeltaTime() / 1000;

    this.updateTransform(this.deltaTime);
    this.switchAnimation(this.currentState);
  }

  public updateTransform(deltaTime: number) {
    this.rootMesh.position = Vector3.Lerp(
      this.rootMesh.position,
      this.targetPosition,
      this.POSITION_LERP_SPEED * deltaTime
    );

    if (this.rootMesh.rotationQuaternion) {
      this.rootMesh.rotationQuaternion = Quaternion.Slerp(
        this.rootMesh.rotationQuaternion,
        this.targetRotation,
        this.ROTATION_LERP_SPEED * deltaTime
      );
    }
  }
}
