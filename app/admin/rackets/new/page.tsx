// app/admin/rackets/new/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { RacketForm } from "../components/RacketForm";
import { RacketFormValues } from "@/app/lib/types"
import { supabase } from "@/app/lib/supabaseClient";

export default function NewRacketPage() {
    const router = useRouter();

    async function handleSubmit(values: RacketFormValues) {
        // const { error } = await supabase.from("rackets").insert({
        //     name: values.name,
        //     weight: values.weight,
        //     weight_category: values.weightCategory,
        //     balance_type: values.balanceType,
        //     length: values.length,
        //     max_tension: values.maxTension,
        //     play_style: values.playStyle,
        //     price: values.price,
        //     grip_size: values.gripSize,
        //     shaft: values.shaft,
        //     link_url: values.linkURL,
        //     note: values.note,
        //     brand_name: values.brandName,
        //     series_name: values.seriesName,
        // });

        // if (!error) router.push("/admin/rackets");
        console.log("todo 라켓 수동 추가 ")
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">새 라켓 추가</h1>
            <RacketForm onSubmit={handleSubmit} submitText="추가" />
        </div>
    );
}
