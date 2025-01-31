import {
  AbstractMesh,
  Matrix,
  MeshBuilder,
  Quaternion,
  Vector3,
} from "@babylonjs/core";
import { Entity } from "../engine/Entity";
import {
  CharacterState,
  IWSAnimationData,
  IWSTransform,
} from "@/world/shared/worldserver.type";
import { toBabylonQuaternion, toBabylonVector3 } from "@/world/utils/Utils";

export class RemoteCharacter extends Entity {
  private targetPosition: Vector3 = Vector3.Zero();
  private targetRotation: Quaternion = Quaternion.Identity();
  private currentAnimationState: CharacterState = CharacterState.IDLE;

  constructor(assetName: string) {
    super(assetName);
  }

  public InitMesh() {
    const outer = MeshBuilder.CreateBox(
      "remoteCharacter",
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

  public Dispose() {}

  public UpdateTransform(deltaTime: number) {
    const lerpFactor = 0.2;
    this.rootMesh.position = Vector3.Lerp(
      this.rootMesh.position,
      this.targetPosition,
      lerpFactor * deltaTime
    );

    if (this.rootMesh.rotationQuaternion) {
      this.rootMesh.rotationQuaternion = Quaternion.Slerp(
        this.rootMesh.rotationQuaternion,
        this.targetRotation,
        lerpFactor * deltaTime
      );
    }
  }

  public ApplyNetworkTransform(data: IWSTransform) {
    this.targetPosition = toBabylonVector3(data.position);
    this.targetRotation = toBabylonQuaternion(data.rotation);
  }

  public ApplyNetworkAnimation(data: IWSAnimationData) {
    this.updateAnimationState(data.state);
  }

  private updateAnimationState(state: CharacterState) {
    this.currentAnimationState = state;
  }
}
