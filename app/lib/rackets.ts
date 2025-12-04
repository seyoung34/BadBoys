import { supabase } from "./supabaseClient";
import { toCamel } from "./toCamel";
import {
  RacketRow,
  RacketMainImage,
  RacketTag,
  RacketViewCamelRow,
} from "./types";

export async function fetchRackets(): Promise<RacketRow[]> {
  const { data, error } = await supabase
    .from("rackets_with_main_image_and_tags")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("fetchRackets error:", error);
    return [];
  }

  const camel = toCamel(data) as RacketViewCamelRow[];

  return camel.map((r): RacketRow => {
    const mainImage: RacketMainImage | null =
      r.mainImageId !== null && r.mainImageUrl !== null
        ? {
          id: r.mainImageId,
          url: r.mainImageUrl,
          alt: r.mainImageAlt,
          orderIndex: r.mainImageOrderIndex,
          isMain: r.mainImageIsMain,
        }
        : null;

    return {
      id: r.id,
      name: r.name,
      weight: r.weight,
      weightCategory: r.weightCategory,
      balanceType: r.balanceType,
      length: r.length,
      maxTension: r.maxTension,
      playStyle: r.playStyle,
      price: r.price,
      gripSize: r.gripSize,
      shaft: r.shaft,
      linkURL: r.linkURL,
      note: r.note,

      brandName: r.brandName,
      seriesName: r.seriesName,

      mainImage,
      tags: r.tags ?? [],
    };
  });
}
