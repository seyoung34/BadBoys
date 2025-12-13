// app/admin/rackets/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { fetchRackets } from "@/app/lib/rackets";
import { supabase } from "@/app/lib/supabaseClient";

import type { RacketRow, RacketFormValues } from "@/app/lib/types";
import { RacketForm } from "../../../components/RacketForm";   // UI Form

// -----------------------------------------------
// RacketRow → RacketFormValues 변환
// -----------------------------------------------
export function racketToFormValues(r: RacketRow): RacketFormValues {
    const v = r.variants.find(v => v.isDefault) ?? null;

    return {
        name: r.name,
        brandName: r.brandName,
        seriesName: r.seriesName,
        note: r.note,

        weight: v?.weight ?? null,
        weightCategory: v?.weightCategory ?? null,
        balanceType: v?.balanceType ?? null,
        shaft: v?.shaft ?? null,
        gripSize: v?.gripSize ?? null,
        maxTension: v?.maxTension ?? null,
        price: v?.price ?? null,
        color: v?.color ?? null,
    };
}

// -----------------------------------------------
// 페이지 컴포넌트
// -----------------------------------------------
export default function EditRacketPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);

    const [initial, setInitial] = useState<RacketFormValues | null>(null);
    const [defaultVariantId, setDefaultVariantId] = useState<number | null>(null);

    useEffect(() => {
        async function load() {
            const rackets = await fetchRackets();
            const racket = rackets.find((r) => r.id === id);

            if (!racket) return;

            const defaultVariant = racket.variants.find(v => v.isDefault) ?? null;
            setDefaultVariantId(defaultVariant?.id ?? null);

            setInitial(racketToFormValues(racket));
        }

        load();
    }, [id]);

    // -------------------------------------------------------
    // 저장 로직 (rackets + racket_variants 모두 업데이트)
    // -------------------------------------------------------
    async function handleSubmit(values: RacketFormValues) {
        // 1) 브랜드 ID 조회 또는 생성
        const { data: brandRow } = await supabase
            .from("brands")
            .select("id")
            .eq("name", values.brandName)
            .maybeSingle();

        let brandId = brandRow?.id ?? null;

        if (!brandId) {
            const { data: newBrand } = await supabase
                .from("brands")
                .insert({ name: values.brandName })
                .select()
                .single();

            brandId = newBrand.id;
        }

        // 2) 시리즈 ID 조회 또는 생성
        let seriesId: number | null = null;

        if (values.seriesName) {
            const { data: seriesRow } = await supabase
                .from("series")
                .select("id")
                .eq("name", values.seriesName)
                .maybeSingle();

            seriesId = seriesRow?.id ?? null;

            if (!seriesId) {
                const { data: newSeries } = await supabase
                    .from("series")
                    .insert({
                        name: values.seriesName,
                        brand_id: brandId
                    })
                    .select()
                    .single();
                seriesId = newSeries.id;
            }
        }

        // 3) racket 업데이트
        const { error: racketErr } = await supabase
            .from("rackets")
            .update({
                name: values.name,
                note: values.note,
                brand_id: brandId,
                series_id: seriesId,
            })
            .eq("id", id);

        if (racketErr) {
            console.error("Racket update failed:", racketErr);
            return;
        }

        // 4) 기본 variant 업데이트
        if (defaultVariantId) {
            const { error: variantErr } = await supabase
                .from("racket_variants")
                .update({
                    weight: values.weight,
                    weight_category: values.weightCategory,
                    balance_type: values.balanceType,
                    max_tension: values.maxTension,
                    grip_size: values.gripSize,
                    shaft: values.shaft,
                    price: values.price,
                    color: values.color
                })
                .eq("id", defaultVariantId);

            if (variantErr) {
                console.error("Variant update failed:", variantErr);
                return;
            }
        }

        router.push("/admin/rackets");
    }

    if (!initial) return <p>불러오는 중...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">라켓 수정</h1>
            <RacketForm initial={initial} onSubmit={handleSubmit} submitText="저장" />
        </div>
    );
}
