export interface AlbumImage {
  id: string;
  path: string;
  filename: string;
  dateTime: string;
  dateTimeOriginal: string;
  dateTimeDigitized: string;
  gallerySpotType: GallerySpotType;
  createdAt: string;
  updatedAt: string;
  checked?: string;
}

export enum GallerySpotType {
  None = "none",
  Spot1 = "spot1",
  Spot2 = "spot2",
  Spot3 = "spot3",
  Spot4 = "spot4",
  Spot5 = "spot5",
  Spot6 = "spot6",
  Spot7 = "spot7",
  Spot8 = "spot8",
  Spot9 = "spot9",
  Spot10 = "spot10",
}
