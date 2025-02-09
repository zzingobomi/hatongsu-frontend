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
      { width: 2, height: 2 },
      this.scene
    );
    plane.parent = this.rootMesh;
    plane.position.y = 4.5;
    plane.billboardMode = AbstractMesh.BILLBOARDMODE_Y;

    const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane);

    const background = new Rectangle();
    background.background = "rgba(0, 0, 0, 0.7)";
    background.cornerRadius = 50;
    background.width = 0.8;
    background.height = "120px";
    background.thickness = 0;
    background.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;

    const textBlock = new TextBlock();
    textBlock.text = nickname;
    textBlock.color = "white";
    textBlock.fontSize = 72;
    textBlock.fontFamily = "Arial";
    textBlock.paddingTop = "8px";
    textBlock.paddingBottom = "8px";
    textBlock.resizeToFit = true;

    background.addControl(textBlock);
    advancedTexture.addControl(background);

    advancedTexture.idealWidth = 800;
    advancedTexture.renderAtIdealSize = true;
  }

  public ShowChattingMessage(message: string, duration: number = 3000): void {
    // 기존 말풍선 제거
    this.clearChattingBubble();

    // 1. 말풍선 메시 생성
    const bubbleMesh = MeshBuilder.CreatePlane(
      "chattingBubble",
      { width: 3, height: 1.5 },
      this.scene
    );
    bubbleMesh.parent = this.rootMesh;
    bubbleMesh.position.y = 3.2; // 닉네임 아래 위치
    bubbleMesh.billboardMode = AbstractMesh.BILLBOARDMODE_Y;

    // 2. GUI 텍스처 생성
    const advancedTexture = AdvancedDynamicTexture.CreateForMesh(bubbleMesh);

    // 3. 말풍선 배경
    const bubbleBackground = new Rectangle();
    bubbleBackground.background = "rgba(255, 255, 255, 0.9)";
    bubbleBackground.cornerRadius = 20;
    bubbleBackground.thickness = 2;
    bubbleBackground.color = "#000000";
    bubbleBackground.paddingTop = "20px";
    bubbleBackground.paddingBottom = "40px"; // 꼬리 공간 확보

    // 4. 말풍선 텍스트
    const textBlock = new TextBlock();
    textBlock.text = message;
    textBlock.color = "#000000";
    textBlock.fontSize = 42;
    textBlock.fontFamily = "Arial";
    textBlock.textWrapping = true;
    textBlock.resizeToFit = true;
    textBlock.width = 0.9; // 90% 너비 사용

    // 5. 말풍선 꼬리
    const tail = new Rectangle();
    tail.width = "40px";
    tail.height = "40px";
    tail.background = "rgba(255, 255, 255, 0.9)";
    tail.thickness = 2;
    tail.color = "#000000";
    tail.rotation = 45; // 45도 회전
    tail.top = "-20px"; // 배경 아래로 이동

    // 계층 구조 구성
    bubbleBackground.addControl(textBlock);
    bubbleBackground.addControl(tail);
    advancedTexture.addControl(bubbleBackground);

    // 6. 자동 제거 설정
    this.chattingTimeout = setTimeout(() => {
      this.clearChattingBubble();
    }, duration);

    this.currentChattingBubble = { mesh: bubbleMesh, texture: advancedTexture };
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
