import "@babylonjs/loaders/glTF/2.0/glTFLoader";
import "@babylonjs/loaders/glTF/2.0/Extensions/KHR_materials_pbrSpecularGlossiness";
import "@babylonjs/loaders/glTF/2.0/Extensions/KHR_draco_mesh_compression";

import {
  Engine,
  Scene,
  Color3,
  Color4,
  DirectionalLight,
  HemisphericLight,
  Vector3,
  ShadowGenerator,
  AbstractMesh,
  AxesViewer,
  Mesh,
  PointLight,
} from "@babylonjs/core";
import { Inspector } from "@babylonjs/inspector";
import { PlayerCamera } from "../core/engine/PlayerCamera";
import { IManager, Managers } from "./Managers";
import { WORLD_NAME } from "../data/const";
import { LoadingScreen } from "../loading/LoadingScreen";

export class WorldManager implements IManager {
  // babylon
  public canvas: HTMLCanvasElement;
  public engine: Engine;
  public scene: Scene;
  public playerCamera: PlayerCamera;

  private loadingScreen: LoadingScreen;

  shadowGenerator: ShadowGenerator;

  constructor() {
    this.canvas = document.getElementById("world-canvas") as HTMLCanvasElement;
    this.engine = new Engine(this.canvas, true, {
      adaptToDeviceRatio: true,
    });
    this.loadingScreen = new LoadingScreen(this.engine);
  }

  public async Init() {
    this.engine.displayLoadingUI();

    await this.initScene();
    this.loadingScreen.updateProgress(0.1);

    await this.initEnvironment();
    this.loadingScreen.updateProgress(0.2);

    await this.initResource();
    this.loadingScreen.updateProgress(0.8);

    this.initGallerySpot();
    this.loadingScreen.updateProgress(1.0);

    window.onresize = () => {
      this.engine.resize();
    };

    this.canvas.onclick = () => {
      this.canvas.requestPointerLock();
    };

    window.addEventListener("keydown", (ev) => {
      if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key === "I") {
        if (Inspector.IsVisible) {
          Inspector.Hide();
        } else {
          Inspector.Show(this.scene, {});
        }
      }
    });

    this.render();

    this.engine.hideLoadingUI();
  }

  public async Dispose() {
    this.engine.stopRenderLoop();
    this.engine.dispose();
    this.scene.dispose();
  }

  public GetShadowGenerator(): ShadowGenerator {
    return this.shadowGenerator;
  }

  private async initScene() {
    this.scene = new Scene(this.engine);
    this.playerCamera = new PlayerCamera(this.scene);
  }

  private async initEnvironment() {
    this.scene.clearColor = Color4.FromInts(200, 230, 255, 255);

    // ambient light
    const ambientLight = new HemisphericLight(
      "light1",
      new Vector3(0, 1, 0),
      this.scene
    );
    ambientLight.intensity = 0.3;
    ambientLight.groundColor = new Color3(1, 1, 1);
    ambientLight.specular = Color3.Black();

    // directional light
    const light = new DirectionalLight(
      "DirectionalLight",
      new Vector3(0, -1, -2),
      this.scene
    );
    light.position = new Vector3(0, 30, 0);
    light.intensity = 1.5;
    light.autoCalcShadowZBounds = true;

    const light2 = new DirectionalLight(
      "DirectionalLight2",
      new Vector3(-1, -1, 0),
      this.scene
    );
    light2.position = new Vector3(30, 30, 0);
    light2.intensity = 1.0;

    // point light
    //const pointLight = new PointLight("PointLight", new Vector3(0, 5, 0));

    //const axisHelper = new AxesViewer(this.scene, 5);

    // shadow
    light.shadowEnabled = true;
    light.shadowMaxZ = 300;
    light.shadowMinZ = 0.1;

    const shadowGenerator = new ShadowGenerator(2048, light);
    shadowGenerator.useContactHardeningShadow = true;
    shadowGenerator.contactHardeningLightSizeUVRatio = 0.03;
    shadowGenerator.bias = 0.005;
    shadowGenerator.normalBias = 0.05;

    this.shadowGenerator = shadowGenerator;
  }

  private async initResource() {
    await Managers.Resource.LoadAssets(this.scene);

    const worldInstance = Managers.Resource.GetAsset(
      WORLD_NAME
    ).instantiateModelsToScene((sourceName) => sourceName);
    const env = worldInstance.rootNodes[0] as AbstractMesh;
    env.getChildMeshes().forEach((m) => {
      this.shadowGenerator.addShadowCaster(m);
      m.receiveShadows = true;
      m.checkCollisions = true;
    });
  }

  private async initGallerySpot() {
    await Managers.GallerySpot.LoadGallerySpot();
    const spotImages = Managers.GallerySpot.GetSpotImages();

    for (const [spotType, { images }] of Object.entries(spotImages)) {
      try {
        const spotImage = images[0];
        const parentNodeName = `${spotType}`;

        const parentNode = this.scene.getTransformNodeByName(parentNodeName);
        if (!parentNode) {
          console.warn(`${spotType}에 해당하는 Transform이 없습니다.`);
          continue;
        }

        const pictureMesh = parentNode
          .getChildren()
          .find((child) => child.name === `${spotType}_picture`) as Mesh;

        const frameMesh = parentNode
          .getChildren()
          .find((child) => child.name === `${spotType}_frame`) as Mesh;

        Managers.GallerySpot.AssignMaterialToGallerySpot(
          parentNode,
          pictureMesh,
          frameMesh,
          spotImage
        );
      } catch (error) {
        console.error(`${spotType} 처리 오류:`, error);
      }
    }
  }

  private render() {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
}
