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
import {
  AdvancedDynamicTexture,
  TextBlock,
  Rectangle,
  Control,
} from "@babylonjs/gui";
import { Managers } from "@/world/managers/Managers";

export abstract class CharacterEntity extends Entity {
  protected currentState: CharacterState = CharacterState.IDLE;
  protected deltaTime: number = 0;
  protected showDebug: boolean = false;

  // nickname
  protected nickname: string;
  protected nicknameText: TextBlock;

  // chatting bubble
  protected currentChattingBubble: {
    mesh: AbstractMesh;
    texture: AdvancedDynamicTexture;
  } | null = null;
  protected chattingTimeout: NodeJS.Timeout | null = null;

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

  public CreateNicknameBillboard(nickname: string): void {
    const plane = MeshBuilder.CreatePlane(
      "nicknamePlane",
      { width: 10, height: 10 },
      this.scene
    );
    plane.parent = this.rootMesh;
    plane.position.y = 4.2;
    plane.billboardMode = AbstractMesh.BILLBOARDMODE_ALL;

    const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane);

    const background = new Rectangle();
    background.background = "rgba(0, 0, 0, 0.5)";
    background.cornerRadius = 16;
    background.thickness = 0;
    background.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    background.adaptWidthToChildren = true;
    background.adaptHeightToChildren = true;

    const textBlock = new TextBlock();
    textBlock.text = nickname;
    textBlock.color = "white";
    textBlock.fontSize = 32;
    textBlock.fontFamily = "Arial";
    textBlock.setPadding(16, 16, 16, 16);
    textBlock.resizeToFit = true;

    background.addControl(textBlock);
    advancedTexture.addControl(background);
  }

  public ShowChattingMessage(message: string, duration: number = 5000): void {
    this.clearChattingBubble();

    const chattingMesh = MeshBuilder.CreatePlane(
      "chattingPlane",
      { width: 10, height: 10 },
      this.scene
    );
    chattingMesh.parent = this.rootMesh;
    chattingMesh.position.y = 5.2;
    chattingMesh.billboardMode = AbstractMesh.BILLBOARDMODE_ALL;

    const advancedTexture = AdvancedDynamicTexture.CreateForMesh(chattingMesh);

    const bubbleContainer = new Rectangle();
    bubbleContainer.background = "rgba(255, 255, 255, 1)";
    bubbleContainer.cornerRadius = 16;
    bubbleContainer.thickness = 0;
    bubbleContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    bubbleContainer.color = "#000000";
    bubbleContainer.adaptWidthToChildren = true;
    bubbleContainer.adaptHeightToChildren = true;
    bubbleContainer.paddingBottom = "30px";

    const textBlock = new TextBlock();
    textBlock.text = this.formatTextWithWordWrap(message);
    textBlock.color = "#000000";
    textBlock.fontSize = 24;
    textBlock.fontFamily = "Arial";
    textBlock.setPadding(16, 16, 16, 16);
    textBlock.resizeToFit = true;

    const tail = new Rectangle();
    tail.width = "30px";
    tail.height = "30px";
    tail.background = "rgba(255, 255, 255, 1)";
    tail.thickness = 0;
    tail.color = "#000000";
    tail.rotation = 45 * (Math.PI / 180);
    tail.top = "15px";

    advancedTexture.addControl(bubbleContainer);
    advancedTexture.addControl(tail);
    bubbleContainer.addControl(textBlock);

    bubbleContainer.onAfterDrawObservable.add(() => {
      if (bubbleContainer._currentMeasure) {
        const containerHeight = bubbleContainer._currentMeasure.height;
        tail.top = containerHeight / 2 - 15 + "px";
      }
    });

    this.chattingTimeout = setTimeout(() => {
      this.clearChattingBubble();
    }, duration);

    this.currentChattingBubble = {
      mesh: chattingMesh,
      texture: advancedTexture,
    };
  }

  private formatTextWithWordWrap(message: string): string {
    const maxLength = 10;
    let result = "";
    let line = "";

    message.split(" ").forEach((word) => {
      if ((line + word).length > maxLength) {
        result += line.trim() + "\n";
        line = "";
      }
      line += word + " ";
    });

    return (result + line).trim();
  }

  private clearChattingBubble(): void {
    if (this.chattingTimeout) {
      clearTimeout(this.chattingTimeout);
      this.chattingTimeout = null;
    }

    if (this.currentChattingBubble) {
      this.currentChattingBubble.texture.dispose();
      this.currentChattingBubble.mesh.dispose();
      this.currentChattingBubble = null;
    }
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
