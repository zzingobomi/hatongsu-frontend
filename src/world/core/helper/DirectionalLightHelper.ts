import * as BABYLON from "@babylonjs/core";

export class DirectionalLightHelper {
  private container: BABYLON.TransformNode;
  private readonly light: BABYLON.DirectionalLight;
  private readonly scene: BABYLON.Scene;
  private readonly size: number;

  constructor(
    light: BABYLON.DirectionalLight,
    scene: BABYLON.Scene,
    size: number = 1
  ) {
    this.light = light;
    this.scene = scene;
    this.size = size;

    this._createHelper();
  }

  private _createHelper(): void {
    // 메인 컨테이너 생성
    this.container = new BABYLON.TransformNode("lightHelper", this.scene);

    // 방향을 나타내는 화살표 생성
    const arrowHead = BABYLON.MeshBuilder.CreateCylinder(
      "arrowHead",
      {
        height: this.size * 0.2,
        diameterTop: 0,
        diameterBottom: this.size * 0.2,
        tessellation: 8,
      },
      this.scene
    );

    const arrowBody = BABYLON.MeshBuilder.CreateCylinder(
      "arrowBody",
      {
        height: this.size,
        diameter: this.size * 0.05,
        tessellation: 8,
      },
      this.scene
    );

    // 화살표 위치 조정
    arrowBody.position.y = this.size / 2;
    arrowHead.position.y = this.size;

    // 머티리얼 생성 및 적용
    const material = new BABYLON.StandardMaterial("helperMaterial", this.scene);
    material.emissiveColor = new BABYLON.Color3(1, 1, 0); // 노란색
    material.disableLighting = true;

    arrowHead.material = material;
    arrowBody.material = material;

    // 컨테이너에 메시 추가
    arrowHead.parent = this.container;
    arrowBody.parent = this.container;

    // 초기 업데이트
    this.update();
  }

  public update(): void {
    if (!this.container) return;

    // 빛의 위치 업데이트
    this.container.position = this.light.position.clone();

    // 빛의 방향에 맞게 회전
    const direction = this.light.direction.normalize();

    // 기본 방향(0,1,0)에서 목표 방향으로의 회전 계산
    const rotationMatrix = BABYLON.Matrix.LookAtLH(
      BABYLON.Vector3.Zero(),
      direction.scale(-1),
      BABYLON.Vector3.Up()
    ).invert();

    const quaternion = BABYLON.Quaternion.FromRotationMatrix(rotationMatrix);
    this.container.rotationQuaternion = quaternion;
  }

  public dispose(): void {
    if (this.container) {
      // 메시와 컨테이너 제거
      this.container.getChildMeshes().forEach((mesh) => mesh.dispose());
      this.container.dispose();
    }
  }

  // getter 메서드들
  public getContainer(): BABYLON.TransformNode {
    return this.container;
  }

  public getLight(): BABYLON.DirectionalLight {
    return this.light;
  }
}
