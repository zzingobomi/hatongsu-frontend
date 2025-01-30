import {
  Mesh,
  MeshBuilder,
  PointLight,
  StandardMaterial,
  Color3,
} from "@babylonjs/core";

export class PointLightHelper {
  private _light: PointLight;
  private _positionMesh: Mesh;
  private _rangeMesh: Mesh;

  constructor(light: PointLight) {
    this._light = light;

    // 광원 위치 표시용 구체 생성
    this._positionMesh = MeshBuilder.CreateSphere(
      "pointLightPositionHelper",
      { diameter: 0.5 },
      light.getScene()
    );
    this._positionMesh.material = new StandardMaterial(
      "helperMaterial",
      light.getScene()
    );
    (this._positionMesh.material as StandardMaterial).emissiveColor =
      Color3.Red();

    // 광범위 표시용 와이어프레임 구체 생성
    this._rangeMesh = MeshBuilder.CreateSphere(
      "pointLightRangeHelper",
      { diameter: light.range * 2, segments: 8 },
      light.getScene()
    );
    this._rangeMesh.material = new StandardMaterial(
      "rangeMaterial",
      light.getScene()
    );
    (this._rangeMesh.material as StandardMaterial).wireframe = true;
    (this._rangeMesh.material as StandardMaterial).emissiveColor =
      Color3.Blue();

    // 선택 불가능하도록 설정
    this._positionMesh.isPickable = false;
    this._rangeMesh.isPickable = false;

    // 초기 위치 업데이트
    this.update();
  }

  // 광원 속성 변경 시 호출하여 업데이트
  public update(): void {
    if (!this._light || !this._light.getScene()) return;

    // 위치 동기화
    this._positionMesh.position.copyFrom(this._light.position);
    this._rangeMesh.position.copyFrom(this._light.position);

    // 범위 동기화
    this._rangeMesh.scaling.setAll(this._light.range * 2);
  }

  // 헬퍼 제거
  public dispose(): void {
    this._positionMesh.dispose();
    this._rangeMesh.dispose();
  }
}
