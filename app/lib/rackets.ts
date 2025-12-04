// ./lib/rackets.ts
import { supabase } from "./supabaseClient";
import { toCamel } from "./toCamel";
import {
  RacketRow,
  RacketVariant,
  RacketImage,
  RacketTag
} from "./types";

export async function fetchRackets(): Promise<RacketRow[]> {
  const { data, error } = await supabase
    .from("racket_full_view")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("fetchRackets error:", error);
    return [];
  }

  const camel = toCamel(data) as Record<string, unknown>[];

  return camel.map((r) => {
    // 안전하게 타입 캐스팅
    const variants = Array.isArray(r.variants)
      ? (r.variants as RacketVariant[])
      : [];

    const tags = Array.isArray(r.tags)
      ? (r.tags as RacketTag[])
      : [];

    const mainImage = r.mainImage
      ? (r.mainImage as RacketImage)
      : null;

    const images = Array.isArray(r.images)
      ? (r.images as RacketImage[])
      : undefined; // optional

    const row: RacketRow = {
      id: r.id as number,
      name: r.name as string,
      note: (r.note as string) ?? null,

      brandName: (r.brandName as string) ?? null,
      seriesName: (r.seriesName as string) ?? null,

      variants,
      mainImage,
      images,
      tags
    };

    return row;
  });
}
