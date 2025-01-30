import {
  AssetsManager,
  AssetContainer,
  Scene,
  ContainerAssetTask,
  MeshAssetTask,
} from "@babylonjs/core";
import { WORLD_NAME } from "../data/resources";

export class ResourceManager {
  private assetsManager: AssetsManager;
  private loadedAssets: { [key: string]: AssetContainer } = {};
  public GetLoadedAssets() {
    return this.loadedAssets;
  }

  public GetAsset(name: string) {
    return this.loadedAssets[name] as AssetContainer;
  }

  public async LoadAssets(scene: Scene) {
    this.assetsManager = new AssetsManager(scene);

    const environmentModelFile = `${WORLD_NAME}.glb`;

    const assetsToLoad = [
      {
        name: environmentModelFile.split(".")[0],
        filename: `${environmentModelFile}`,
        extension: environmentModelFile.split(".")[1],
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
