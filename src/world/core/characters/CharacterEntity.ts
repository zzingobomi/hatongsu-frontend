import { CharacterState, IWSTransform } from "@/world/shared/worldserver.type";
import { Entity } from "../engine/Entity";
import { toBabylonQuaternion, toBabylonVector3 } from "@/world/utils/Utils";
import {
  AbstractMesh,
  Color3,
  Matrix,
  MeshBuilder,
  Quaternion,
  Scalar,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core";
import { Managers } from "@/world/managers/Managers";

export abstract class CharacterEntity extends Entity {
  protected currentState: CharacterState = CharacterState.IDLE;
  protected deltaTime: number = 0;
  protected showDebug: boolean = false;

  constructor(assetName: string) {
    super(assetName);
    this.scene.registerBeforeRender(this.update.bind(this));
  }

  public InitMesh(): void {
    const outer = this.createCharacterBox();
    this.setupMeshHierarchy(outer);
    this.initializeAnimations();
    this.setupDebugMaterial(outer);
  }

  public InitTransform(transform: IWSTransform): void {
    const initialPosition = toBabylonVector3(transform.position);
    const initialRotation = toBabylonQuaternion(transform.rotation);

    this.rootMesh.position = initialPosition;
    this.rootMesh.rotationQuaternion = initialRotation;
  }

  public Dispose(): void {
    this.disposeAnimations();
    this.disposeMeshes();
  }

  protected abstract update(): void;

  protected setState(state: CharacterState): void {
    this.currentState = state;
  }

  protected switchAnimation(state: CharacterState): void {
    for (let i = 0; i < this.animationGroups.length; i++) {
      if (state === i) {
        this.animationGroups[i].weight += 0.005 * this.deltaTime * 1000;
      } else {
        this.animationGroups[i].weight -= 0.005 * this.deltaTime * 1000;
      }
      this.animationGroups[i].weight = Scalar.Clamp(
        this.animationGroups[i].weight,
        0.0,
        1.0
      );
    }
  }

  private createCharacterBox(): AbstractMesh {
    const outer = MeshBuilder.CreateBox(
      this.name,
      { width: 2, depth: 1, height: 3 },
      this.scene
    );
    outer.isVisible = false;
    outer.isPickable = false;
    outer.checkCollisions = true;

    outer.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0));

    outer.ellipsoid = new Vector3(1, 1.5, 1);
    outer.ellipsoidOffset = new Vector3(0, 1.5, 0);

    outer.rotationQuaternion = new Quaternion(0, 1, 0, 0);

    return outer;
  }

  private setupMeshHierarchy(outer: AbstractMesh): void {
    this.rootMesh = outer as any;
    this.rootMesh.parent = this;

    const mesh = this.rootNodes[0] as AbstractMesh;
    mesh.parent = this.rootMesh;
    mesh.isPickable = false;
    mesh.getChildMeshes().forEach((m) => {
      Managers.World.GetShadowGenerator().addShadowCaster(m);
      m.isPickable = false;
    });

    this.mesh = mesh;
  }

  private initializeAnimations(): void {
    for (const animationGroup of this.animationGroups) {
      animationGroup.play(true);
    }
    this.animationGroups[CharacterState.IDLE].weight = 1.0;
    this.animationGroups[CharacterState.WALKING].weight = 0.0;
    this.animationGroups[CharacterState.RUNNING].weight = 0.0;
    this.animationGroups[CharacterState.JUMP].weight = 0.0;
  }

  private setupDebugMaterial(outer: AbstractMesh): void {
    if (this.showDebug) {
      const material = new StandardMaterial("charMaterial", this.scene);
      material.alpha = 0.3;
      material.diffuseColor = new Color3(0.5, 0.5, 1);
      material.emissiveColor = new Color3(0.2, 0.2, 0.5);
      material.backFaceCulling = false;

      outer.isVisible = true;
      outer.material = material;
    }
  }

  private disposeAnimations(): void {
    for (const animationGroup of this.animationGroups) {
      animationGroup.stop();
      animationGroup.dispose();
    }
    this.animationGroups = [];
  }

  private disposeMeshes(): void {
    if (this.rootMesh) {
      this.rootMesh.dispose();
    }

    if (this.showDebug && this.rootMesh && this.rootMesh.material) {
      (this.rootMesh.material as StandardMaterial).dispose();
    }
  }
}
