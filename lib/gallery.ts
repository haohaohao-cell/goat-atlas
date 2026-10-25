import galleryJson from "@/data/gallery.json";
import { gallerySchema } from "./schemas";
import type { GalleryData } from "./types";

export const gallery: GalleryData = gallerySchema.parse(
  galleryJson,
) as GalleryData;

export function galleryByEra(eraId: string) {
  return gallery.items.filter((item) => item.era === eraId);
}
