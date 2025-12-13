// app/admin/rackets/new/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { RacketForm } from "../../components/RacketForm";
import type { RacketFormValues } from "@/app/lib/types";
import { convertFormToNormalized } from "@/app/admin/upload/new/formToNormalize";
import { uploadRacketToDB } from "../uploadUtil";

export default function NewRacketPage() {
    const router = useRouter();

    async function handleSubmit(values: RacketFormValues) {
        try {
            const normalized = convertFormToNormalized(values);

            const id = await uploadRacketToDB(normalized);

            console.log("라켓 추가 완료 id =", id);
            router.push("/admin/rackets");
        } catch (err) {
            console.error("Manual add error:", err);
            alert("업로드 중 오류 발생: " + (err as Error).message);
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">새 라켓 추가</h1>
            <RacketForm onSubmit={handleSubmit} submitText="추가" />
        </div>
    );
}
