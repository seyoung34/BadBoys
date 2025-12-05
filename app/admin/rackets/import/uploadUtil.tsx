import { supabase } from "@/app/lib/supabaseClient";
import {
    RacketRow,
    RacketVariant,
    RacketTag,
    RacketImage,
    NormalizedRacketInput
} from "@/app/lib/types";

export async function findOrCreateBrand(brandName: string): Promise<number> {
    if (!brandName.trim()) {
        throw new Error("brandName is empty");
    }

    // 1) 존재하는지 조회
    const { data: existing, error: selectErr } = await supabase
        .from("brands")
        .select("id")
        .eq("name", brandName)
        .maybeSingle();

    if (selectErr) throw selectErr;

    if (existing?.id) return existing.id;

    // 2) 없으면 생성
    const { data: inserted, error: insertErr } = await supabase
        .from("brands")
        .insert({ name: brandName })
        .select("id")
        .single();

    if (insertErr) throw insertErr;

    return inserted.id;
}

//브랜드는 create or find 
async function upsertBrand(brandName: string | null): Promise<number> {

    const { data, error } = await supabase
        .from("brands")
        .upsert({ name: brandName }, { onConflict: "name" })
        .select("id")
        .single();

    if (error) throw new Error("Brand upsert failed: " + error.message);
    return data.id;
}

export async function findOrCreateSeries(seriesName: string | null, brandId: number): Promise<number> {
    if (!seriesName) {
        throw new Error("seires is empty");
    }

    // 1) 존재하는지 조회
    const { data: existing, error: selectErr } = await supabase
        .from("series")
        .select("id")
        .eq("name", seriesName)
        .maybeSingle();

    if (selectErr) throw selectErr;

    if (existing?.id) return existing.id;

    // 2) 없으면 생성
    const { data: inserted, error: insertErr } = await supabase
        .from("series")
        .insert({ brand_id: brandId, name: seriesName })
        .select("id")
        .single();

    if (insertErr) throw insertErr;

    return inserted.id;
}

async function upsertSeries(seriesName: string | null): Promise<number | null> {
    if (!seriesName) return null;

    const { data, error } = await supabase
        .from("series")
        .upsert({ name: seriesName }, { onConflict: "name" })
        .select("id")
        .single();

    if (error) throw new Error("Series upsert failed: " + error.message);
    return data.id;
}

async function upsertRacket(
    input: NormalizedRacketInput,
    brandId: number,
    seriesId: number | null
): Promise<number> {
    const { data, error } = await supabase
        .from("rackets")
        .upsert(
            {
                name: input.name,
                note: input.note,
                brand_id: brandId,
                series_id: seriesId
            },
            { onConflict: "name" }
        )
        .select("id")
        .single();

    if (error) throw new Error("Racket upsert failed: " + error.message);
    return data.id;
}

async function upsertVariants(
    racketId: number,
    variants: NormalizedRacketInput["variants"]
): Promise<void> {
    const rows = variants.map(v => ({
        racket_id: racketId,
        weight: v.weight,
        weight_category: v.weightCategory,
        balance_type: v.balanceType,
        shaft: v.shaft,
        grip_size: v.gripSize,
        max_tension: v.maxTension,
        price: v.price,
        color: v.color,
        is_default: v.isDefault
    }));

    const { error } = await supabase
        .from("racket_variants")
        .upsert(rows, { onConflict: "racket_id, weight_category, color, grip_size, balance_type, shaft" });

    if (error) throw new Error("Variant upsert failed: " + error.message);
}

// 태그는 추후에
// async function upsertTags(
//     racketId: number,
//     tags: NormalizedRacketInput["tags"]
// ): Promise<void> {
//     for (const tag of tags) {
//         const { data: tagRow, error: tagErr } = await supabase
//             .from("tags")
//             .upsert({ name: tag.name, category: tag.category }, { onConflict: "name" })
//             .select("id")
//             .single();

//         if (tagErr) throw new Error("Tag upsert failed: " + tagErr.message);

//         const tagId = tagRow.id;

//         const { error: mapErr } = await supabase
//             .from("racket_tags")
//             .upsert(
//                 { racket_id: racketId, tag_id: tagId },
//                 { onConflict: "racket_id,tag_id" }
//             );

//         if (mapErr) throw new Error("Tag mapping failed: " + mapErr.message);
//     }
// }


//이미지도 추후에
// async function upsertImages(
//     racketId: number,
//     images: NormalizedRacketInput["images"]
// ): Promise<void> {
//     if (!images || images.length === 0) return;

//     const rows = images.map(img => ({
//         racket_id: racketId,
//         url: img.url,
//         alt: img.alt,
//         order_index: img.orderIndex,
//         is_main: img.isMain
//     }));

//     const { error } = await supabase
//         .from("racket_images")
//         .upsert(rows, { onConflict: "racket_id,url" });

//     if (error) throw new Error("Image upsert failed: " + error.message);
// }


export async function uploadRacketToDB(
    input: NormalizedRacketInput
): Promise<number> {

    const brandId = await findOrCreateBrand(input.brandName);
    const seriesId = await findOrCreateSeries(input.seriesName, brandId);

    const racketId = await upsertRacket(input, brandId, seriesId);

    await upsertVariants(racketId, input.variants);
    //   await upsertTags(racketId, input.tags);
    //   await upsertImages(racketId, input.images);

    return racketId;
}

