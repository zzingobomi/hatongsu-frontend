import {
  AssetsManager,
  AssetContainer,
  Scene,
  ContainerAssetTask,
  MeshAssetTask,
} from "@babylonjs/core";
import { PLAYER_NAME, WORLD_NAME } from "../data/const";
import { IManager } from "./Managers";

export class ResourceManager implements IManager {
  private assetsManager: AssetsManager;
  private loadedAssets: { [key: string]: AssetContainer } = {};

  public async Init() {}

  public async Dispose() {
    for (const key in this.loadedAssets) {
      this.loadedAssets[key].dispose();
    }
    this.loadedAssets = {};
  }

  public GetLoadedAssets() {
    return this.loadedAssets;
  }

  public GetAsset(name: string) {
    return this.loadedAssets[name] as AssetContainer;
  }

  public async LoadAssets(scene: Scene) {
    this.assetsManager = new AssetsManager(scene);
    this.assetsManager.autoHideLoadingUI = false;

    const environmentFile = `${WORLD_NAME}.glb`;
    const playerFile = `${PLAYER_NAME}.glb`;

    const assetsToLoad = [
      {
        name: environmentFile.split(".")[0],
        filename: `${environmentFile}`,
        extension: environmentFile.split(".")[1],
        instantiate: true,
      },
      {
        name: playerFile.split(".")[0],
        filename: `${playerFile}`,
        extension: playerFile.split(".")[1],
        instantiate: true,
      },
    ];

    assetsToLoad.forEach((asset) => {
      let assetTask: ContainerAssetTask | MeshAssetTask | undefined;
      switch (asset.extension) {
        case "babylon":
        case "gltf":
        case "glb":
        case "obj":
          if (asset.instantiate) {
            assetTask = this.assetsManager.addContainerTask(
              asset.name,
              "",
              `${process.env.NEXT_PUBLIC_STATIC_BASE_URL}`,
              `${asset.filename}`
            );
          } else {
            assetTask = this.assetsManager.addMeshTask(
              asset.name,
              "",
              `${process.env.NEXT_PUBLIC_STATIC_BASE_URL}`,
              `${asset.filename}`
            );
          }
          break;

        default:
          console.error(
            `Error loading asset ${asset.name}. Unrecognized file extension ${asset.extension}`
          );
      }

      if (assetTask) {
        assetTask.onSuccess = (task: any) => {
          switch (task.constructor) {
            case ContainerAssetTask:
              this.loadedAssets[task.name] = task.loadedContainer;
              break;
            case MeshAssetTask:
              this.loadedAssets[task.name] = task;
              break;
            default:
              console.log(
                `Error loading asset ${task.name}. Unrecognized AssetManager task type.`
              );
              break;
          }
        };

        assetTask.onError = (task: any, message: any, exception: any) => {
          console.log(message, exception);
        };
      }
    });

    await this.assetsManager.loadAsync();
  }
}
