import { AlbumImage } from "@/model/AlbumImage";
import { IManager, Managers } from "./Managers";
import {
  Color3,
  Mesh,
  Scene,
  StandardMaterial,
  Texture,
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

  // TODO: 이미지 회전 및 크기 조절하기
  public AssignMaterialToGallerySpot(spotMesh: Mesh, albumImage: AlbumImage) {
    const material = new StandardMaterial(`${spotMesh.name}_Mat`, this.scene);
    const texture = new Texture(
      albumImage.path,
      this.scene,
      false,
      true,
      Texture.TRILINEAR_SAMPLINGMODE,
      () => {
        const size = texture.getSize();
        console.log(`Image width: ${size.width}, height: ${size.height}`);

        texture.uScale = 1;
        texture.vScale = -1;
        texture.anisotropicFilteringLevel = 16;

        material.diffuseTexture = texture;
        material.specularColor = new Color3(0, 0, 0);

        spotMesh.material = material;

        spotMesh.scaling.y = 2;
      }
    );
  }
}
