"use client";

import { useState } from "react";
import type { RacketRow } from "@/app/lib/types";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

export type RacketFormValues = Omit<RacketRow, "id" | "mainImage" | "tags">;

interface Props {
    initial?: RacketFormValues | null;    // 수정 시 전달
    onSubmit: (values: RacketFormValues) => Promise<void>;
    submitText?: string;
}

export function RacketForm({ initial, onSubmit, submitText = "저장" }: Props) {
    const [values, setValues] = useState<RacketFormValues>(
        initial ?? {
            name: "",
            weight: null,
            weightCategory: "",
            balanceType: "",
            length: null,
            maxTension: null,
            playStyle: "",
            price: null,
            gripSize: "",
            shaft: null,
            linkURL: "",
            note: "",
            brandName: "",
            seriesName: "",
        }
    );

    const handleChange = (key: keyof RacketFormValues, value: string | number | null) => {
        setValues((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await onSubmit(values);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
            {/* 이름 */}
            <div>
                <Label>라켓 이름</Label>
                <Input
                    value={values.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                />
            </div>

            {/* 브랜드 */}
            <div>
                <Label>브랜드</Label>
                <Input
                    value={values.brandName ?? ""}
                    onChange={(e) => handleChange("brandName", e.target.value)}
                    required
                />
            </div>

            {/* 시리즈 */}
            <div>
                <Label>시리즈</Label>
                <Input
                    value={values.seriesName ?? ""}
                    onChange={(e) => handleChange("seriesName", e.target.value)}
                />
            </div>

            {/* 무게 */}
            <div>
                <Label>무게 (g)</Label>
                <Input
                    type="number"
                    value={values.weight ?? ""}
                    onChange={(e) => handleChange("weight", Number(e.target.value))}
                />
            </div>

            {/* 가격 */}
            <div>
                <Label>가격</Label>
                <Input
                    type="number"
                    value={values.price ?? ""}
                    onChange={(e) => handleChange("price", Number(e.target.value))}
                />
            </div>

            {/* 링크 */}
            <div>
                <Label>공식 링크(URL)</Label>
                <Input
                    type="text"
                    value={values.linkURL ?? ""}
                    onChange={(e) => handleChange("linkURL", e.target.value)}
                />
            </div>

            {/* 비고 */}
            <div>
                <Label>비고</Label>
                <textarea
                    value={values.note ?? ""}
                    onChange={(e) => handleChange("note", e.target.value)}
                    className="w-full border rounded p-2"
                    rows={4}
                />
            </div>

            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                {submitText}
            </Button>
        </form>
    );
}
