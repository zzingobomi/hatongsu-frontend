import { Managers } from "@/world/managers/Managers";
import {
  AbstractMesh,
  AnimationGroup,
  InstantiatedEntries,
  Mesh,
  Skeleton,
  TransformNode,
  Node,
  Scene,
  Engine,
} from "@babylonjs/core";

export abstract class Entity extends TransformNode {
  engine: Engine;
  scene: Scene;

  instanceModel: InstantiatedEntries;
  rootMesh: Mesh;
  mesh: AbstractMesh;
  rootNodes: Node[];
  skeletons: Skeleton[];
  animationGroups: AnimationGroup[];

  constructor(assetName: string) {
    super(assetName, Managers.World.scene);
    this.engine = Managers.World.engine;
    this.scene = Managers.World.scene;

    this.instanceModel =
      Managers.Resource.GetAsset(assetName).instantiateModelsToScene();
    this.rootNodes = this.instanceModel.rootNodes;
    this.skeletons = this.instanceModel.skeletons;
    this.animationGroups = this.instanceModel.animationGroups;
    this.animationGroups.forEach((animationGroup, index) => {
      animationGroup.name = animationGroup.name.replace("Clone of ", "");
    });
  }

  abstract InitMesh(): void;

  abstract Dispose(): void;
}
