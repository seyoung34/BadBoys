// app/admin/rackets/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RacketForm, RacketFormValues } from "../../components/RacketForm";
import { supabase } from "@/app/lib/supabaseClient";
import { fetchRackets } from "@/app/lib/rackets";

export default function EditRacketPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);

    const [initial, setInitial] = useState<RacketFormValues | null>(null);

    useEffect(() => {
        async function load() {
            const rackets = await fetchRackets();
            const racket = rackets.find((r) => r.id === id);

            if (racket) {
                setInitial({
                    name: racket.name,
                    weight: racket.weight,
                    weightCategory: racket.weightCategory,
                    balanceType: racket.balanceType,
                    length: racket.length,
                    maxTension: racket.maxTension,
                    playStyle: racket.playStyle,
                    price: racket.price,
                    gripSize: racket.gripSize,
                    shaft: racket.shaft,
                    linkURL: racket.linkURL,
                    note: racket.note,
                    brandName: racket.brandName,
                    seriesName: racket.seriesName,
                });
            }
        }
        load();
    }, [id]);

    async function handleSubmit(values: RacketFormValues) {
        const { error } = await supabase.from("rackets").update({
            name: values.name,
            weight: values.weight,
            weight_category: values.weightCategory,
            balance_type: values.balanceType,
            length: values.length,
            max_tension: values.maxTension,
            play_style: values.playStyle,
            price: values.price,
            grip_size: values.gripSize,
            shaft: values.shaft,
            link_url: values.linkURL,
            note: values.note,
            brand_name: values.brandName,
            series_name: values.seriesName,
        }).eq("id", id);

        if (!error) router.push("/admin/rackets");
    }

    if (!initial) return <p>불러오는 중...</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">라켓 수정</h1>
            <RacketForm initial={initial} onSubmit={handleSubmit} submitText="저장" />
        </div>
    );
}
