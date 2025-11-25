// lib/rackets.ts
import { supabase } from "./supabaseClient";

export type RacketRow = {
    id: number;
    name: string;
    weight: number | null;
    weightCategory: string | null;
    balanceType: string | null;
    length: number | null;
    maxTension: number | null;
    playStyle: string | null;
    price: number | null;
    gripSize: string | null;
    shaft: number | null;
    linkURL: string | null;
    note: string | null;
    brands: {
        name: string;
    } | null;
    series: {
        name: string;
    } | null;
    racket_tags: {
        tags: {
            name: string;
            category: string | null;
        } | null;
    }[];
};

export async function fetchRackets(): Promise<RacketRow[]> {
    const { data, error } = await supabase
        .from("rackets")
        .select(`
      id,
      name,
      weight,
      weightCategory,
      balanceType,
      length,
      maxTension,
      playStyle,
      price,
      gripSize,
      shaft,
      linkURL,
      note,
      brands (
        name
      ),
      series (
        name
      ),
      racket_tags (
        tags (
          name,
          category
        )
      )
    `)
        .order("id", { ascending: true });

    if (error) {
        // 실제 서비스라면 로깅 필요
        console.error("fetchRackets error:", error);
        return [];
    }

    // 타입 단언
    return (data ?? []) as unknown as RacketRow[];
}
