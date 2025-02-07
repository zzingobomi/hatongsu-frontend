import { AlbumImage } from "@/model/AlbumImage";
import { IManager, Managers } from "./Managers";
import {
  Color3,
  Mesh,
  Scene,
  StandardMaterial,
  Texture,
  TransformNode,
} from "@babylonjs/core";
import axios from "axios";

export class GallerySpotManager implements IManager {
  scene: Scene;
  images: AlbumImage[] = [];

  public async Init() {
    this.scene = Managers.World.scene;
  }

  public async Dispose() {}

  public async LoadGallerySpot() {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/album/gallery/spot`
    );
    this.images = response.data.albumImages;
  }

  public GetImages(): AlbumImage[] {
    return this.images;
  }

  // TODO: 추후 블렌더를 좀 더 잘 다루게 되면, 축 계산 다시 해보기
  public AssignMaterialToGallerySpot(
    parentNode: TransformNode,
    pictureMesh: Mesh,
    frameMesh: Mesh,
    albumImage: AlbumImage
  ) {
    const material = new StandardMaterial(
      `${pictureMesh.name}_Mat`,
      this.scene
    );
    const texture = new Texture(
      albumImage.path,
      this.scene,
      false,
      true,
      Texture.TRILINEAR_SAMPLINGMODE,
      () => {
        const size = texture.getSize();
        //console.log(`Image width: ${size.width}, height: ${size.height}`);

        texture.uScale = 1;
        texture.vScale = -1;
        texture.wAng = Math.PI / 2;
        texture.anisotropicFilteringLevel = 16;

        material.diffuseTexture = texture;
        material.specularColor = new Color3(0, 0, 0);

        const imageWidth = size.width;
        const imageHeight = size.height;
        const isPortrait = imageHeight > imageWidth;

        const effectiveAspect = isPortrait
          ? imageHeight / imageWidth
          : imageWidth / imageHeight;

        // parentNode scale 은 같다고 가정
        const baseSize = parentNode.scaling.x;

        if (isPortrait) {
          // 세로 모드: x축(높이)을 기준으로 스케일링
          pictureMesh.scaling.x = baseSize * effectiveAspect;
          pictureMesh.scaling.z = baseSize;

          frameMesh.scaling.y = baseSize * effectiveAspect * 1.1;
          frameMesh.scaling.z = baseSize * 1.1;
        } else {
          // 가로 모드: z축(너비)을 기준으로 스케일링
          pictureMesh.scaling.z = baseSize * effectiveAspect;
          pictureMesh.scaling.x = baseSize;

          frameMesh.scaling.z = baseSize * effectiveAspect * 1.1;
          frameMesh.scaling.y = baseSize * 1.1;
        }

        pictureMesh.material = material;

        parentNode.scaling.setAll(1);
      }
    );
  }
}
